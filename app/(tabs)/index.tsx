import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Shield, Bell, Users, MapPin, Activity, AlertTriangle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

export default function Home() {
  const { profile } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const [stats, setStats] = useState({
    activeAlerts: 0,
    networkUsers: 0,
    safeZones: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [alertsRes, networkRes, zonesRes] = await Promise.all([
      supabase.from('sos_alerts').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('suraksha_network_users').select('id', { count: 'exact', head: true }).eq('is_available', true),
      supabase.from('safe_zones').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      activeAlerts: alertsRes.count || 0,
      networkUsers: networkRes.count || 0,
      safeZones: zonesRes.count || 0,
    });
  };

  const quickActions = [
    {
      icon: Shield,
      title: 'Emergency SOS',
      color: colors.danger,
      onPress: () => router.push('/(tabs)/sos'),
    },
    {
      icon: MapPin,
      title: 'Safe Zones',
      color: colors.success,
      onPress: () => router.push('/(tabs)/map'),
    },
    {
      icon: Users,
      title: 'Network',
      color: colors.secondary,
      onPress: () => router.push('/(tabs)/map'),
    },
    {
      icon: Bell,
      title: 'Alerts',
      color: colors.warning,
      onPress: () => {},
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Activity size={24} color={colors.danger} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.activeAlerts}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Alerts</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Users size={24} color={colors.secondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.networkUsers}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Network Users</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <MapPin size={24} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.safeZones}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Safe Zones</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { backgroundColor: colors.card }]}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <action.icon size={28} color={action.color} />
                </View>
                <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Safety Tips</Text>
          <View style={[styles.tipCard, { backgroundColor: colors.primaryLight }]}>
            <AlertTriangle size={20} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.text }]}>
              Always share your location with trusted contacts when traveling alone
            </Text>
          </View>
          <View style={[styles.tipCard, { backgroundColor: colors.successLight }]}>
            <Shield size={20} color={colors.success} />
            <Text style={[styles.tipText, { color: colors.text }]}>
              Keep your emergency contacts updated in your profile
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.sosButton, { backgroundColor: colors.danger }]}
          onPress={() => router.push('/(tabs)/sos')}
        >
          <Shield size={32} color="#FFFFFF" />
          <Text style={styles.sosButtonText}>Trigger Emergency SOS</Text>
        </TouchableOpacity>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  sosButton: {
    flexDirection: 'row',
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  sosButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
