import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Shield, Phone, MapPin, Mic, Video, XCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import * as Location from 'expo-location';

export default function SOS() {
  const { profile } = useAuth();
  const { colors } = useTheme();
  const [activeAlert, setActiveAlert] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);

  useEffect(() => {
    requestLocationPermission();
    loadEmergencyContacts();
    checkActiveAlerts();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    }
  };

  const loadEmergencyContacts = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', profile.id)
      .order('priority', { ascending: true })
      .limit(3);

    if (data) {
      setEmergencyContacts(data);
    }
  };

  const checkActiveAlerts = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('sos_alerts')
      .select('*')
      .eq('user_id', profile.id)
      .eq('status', 'active')
      .order('triggered_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setActiveAlert(data);
    }
  };

  const triggerSOS = async (alertType: string = 'manual') => {
    if (!profile || !location) {
      Alert.alert('Error', 'Unable to get your location. Please enable location services.');
      return;
    }

    setLoading(true);

    try {
      const { data: alert, error } = await supabase
        .from('sos_alerts')
        .insert({
          user_id: profile.id,
          latitude: location.latitude,
          longitude: location.longitude,
          alert_type: alertType,
          status: 'active',
          description: `Emergency alert triggered by ${profile.full_name}`,
        })
        .select()
        .single();

      if (error) throw error;

      setActiveAlert(alert);

      await supabase.from('notifications').insert(
        emergencyContacts.map(contact => ({
          user_id: profile.id,
          type: 'sos_alert',
          title: 'Emergency SOS Alert',
          message: `${profile.full_name} has triggered an emergency alert. Location: ${location.latitude}, ${location.longitude}`,
          data: { alert_id: alert.id },
        }))
      );

      Alert.alert('SOS Activated', 'Your emergency contacts and nearby network users have been notified.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelSOS = async () => {
    if (!activeAlert) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('sos_alerts')
        .update({ status: 'cancelled', resolved_at: new Date().toISOString() })
        .eq('id', activeAlert.id);

      if (error) throw error;

      setActiveAlert(null);
      Alert.alert('SOS Cancelled', 'Your emergency alert has been cancelled.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (activeAlert) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.danger }]}>
          <Shield size={48} color="#FFFFFF" />
          <Text style={styles.headerTitle}>SOS ACTIVE</Text>
          <Text style={styles.headerSubtitle}>Help is on the way</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={[styles.alertCard, { backgroundColor: colors.dangerLight }]}>
            <Text style={[styles.alertTitle, { color: colors.danger }]}>Emergency Alert Active</Text>
            <Text style={[styles.alertText, { color: colors.text }]}>
              Your emergency contacts and nearby network users have been notified.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contacts Notified</Text>
            {emergencyContacts.map(contact => (
              <View key={contact.id} style={[styles.contactCard, { backgroundColor: colors.card }]}>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
                  <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>{contact.phone}</Text>
                </View>
                <TouchableOpacity style={[styles.callButton, { backgroundColor: colors.success }]}>
                  <Phone size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Location</Text>
            <View style={[styles.locationCard, { backgroundColor: colors.card }]}>
              <MapPin size={24} color={colors.primary} />
              <View style={styles.locationInfo}>
                <Text style={[styles.locationText, { color: colors.text }]}>
                  Latitude: {activeAlert.latitude}
                </Text>
                <Text style={[styles.locationText, { color: colors.text }]}>
                  Longitude: {activeAlert.longitude}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.textSecondary }]}
            onPress={cancelSOS}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <XCircle size={24} color="#FFFFFF" />
                <Text style={styles.cancelButtonText}>Cancel SOS</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Shield size={48} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Emergency SOS</Text>
        <Text style={styles.headerSubtitle}>Get help when you need it most</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.infoCard, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.infoText, { color: colors.text }]}>
            Pressing the SOS button will immediately alert your emergency contacts and nearby verified network users with your location.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.mainSOSButton, { backgroundColor: colors.danger }]}
          onPress={() => triggerSOS('manual')}
          disabled={loading || !location}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <>
              <Shield size={64} color="#FFFFFF" />
              <Text style={styles.mainSOSButtonText}>TRIGGER SOS</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Alternative Triggers</Text>
          <View style={styles.alternativeGrid}>
            <TouchableOpacity
              style={[styles.alternativeCard, { backgroundColor: colors.card }]}
              onPress={() => triggerSOS('voice_triggered')}
              disabled={loading}
            >
              <View style={[styles.alternativeIcon, { backgroundColor: colors.dangerLight }]}>
                <Mic size={32} color={colors.danger} />
              </View>
              <Text style={[styles.alternativeTitle, { color: colors.text }]}>Voice Alert</Text>
              <Text style={[styles.alternativeSubtitle, { color: colors.textSecondary }]}>
                Say help phrase
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.alternativeCard, { backgroundColor: colors.card }]}
              onPress={() => triggerSOS('motion_detected')}
              disabled={loading}
            >
              <View style={[styles.alternativeIcon, { backgroundColor: colors.warningLight }]}>
                <Video size={32} color={colors.warning} />
              </View>
              <Text style={[styles.alternativeTitle, { color: colors.text }]}>Shake Device</Text>
              <Text style={[styles.alternativeSubtitle, { color: colors.textSecondary }]}>
                Shake to alert
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contacts</Text>
          {emergencyContacts.length > 0 ? (
            emergencyContacts.map(contact => (
              <View key={contact.id} style={[styles.contactCard, { backgroundColor: colors.card }]}>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
                  <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>{contact.phone}</Text>
                </View>
                <TouchableOpacity style={[styles.callButton, { backgroundColor: colors.success }]}>
                  <Phone size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No emergency contacts added. Add contacts in your profile.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  mainSOSButton: {
    height: 200,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  mainSOSButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  alternativeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  alternativeCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  alternativeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alternativeTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  alternativeSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  alertCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  alertText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  locationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  cancelButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
