import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { MapPin, Shield, AlertTriangle, Search, Navigation } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function MapScreen() {
  const { colors } = useTheme();
  const [safeZones, setSafeZones] = useState<any[]>([]);
  const [dangerZones, setDangerZones] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'safe' | 'danger'>('safe');

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    const [safeRes, dangerRes] = await Promise.all([
      supabase.from('safe_zones').select('*').order('rating', { ascending: false }),
      supabase.from('danger_zones').select('*').order('danger_level', { ascending: false }),
    ]);

    if (safeRes.data) setSafeZones(safeRes.data);
    if (dangerRes.data) setDangerZones(dangerRes.data);
  };

  const getZoneIcon = (type: string) => {
    return MapPin;
  };

  const getDangerColor = (level: string) => {
    switch (level) {
      case 'critical':
        return colors.danger;
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return colors.warning;
      default:
        return '#FFD93D';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Safe & Danger Zones</Text>
        <Text style={styles.headerSubtitle}>Find safe places and avoid risky areas</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search zones..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              { backgroundColor: activeTab === 'safe' ? colors.success : colors.card },
            ]}
            onPress={() => setActiveTab('safe')}
          >
            <Shield size={20} color={activeTab === 'safe' ? '#FFFFFF' : colors.textSecondary} />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'safe' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Safe Zones
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              { backgroundColor: activeTab === 'danger' ? colors.danger : colors.card },
            ]}
            onPress={() => setActiveTab('danger')}
          >
            <AlertTriangle size={20} color={activeTab === 'danger' ? '#FFFFFF' : colors.textSecondary} />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'danger' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Danger Zones
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.zonesList} showsVerticalScrollIndicator={false}>
          {activeTab === 'safe' ? (
            safeZones.length > 0 ? (
              safeZones
                .filter(zone => zone.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(zone => (
                  <View key={zone.id} style={[styles.zoneCard, { backgroundColor: colors.card }]}>
                    <View style={[styles.zoneIcon, { backgroundColor: colors.successLight }]}>
                      <MapPin size={24} color={colors.success} />
                    </View>
                    <View style={styles.zoneInfo}>
                      <Text style={[styles.zoneName, { color: colors.text }]}>{zone.name}</Text>
                      <Text style={[styles.zoneType, { color: colors.textSecondary }]}>
                        {zone.type.replace('_', ' ').toUpperCase()}
                      </Text>
                      {zone.address && (
                        <Text style={[styles.zoneAddress, { color: colors.textLight }]}>
                          {zone.address}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity style={[styles.navigateButton, { backgroundColor: colors.primary }]}>
                      <Navigation size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
                <Shield size={48} color={colors.textLight} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No safe zones available yet
                </Text>
              </View>
            )
          ) : (
            dangerZones.length > 0 ? (
              dangerZones.map(zone => (
                <View key={zone.id} style={[styles.zoneCard, { backgroundColor: colors.card }]}>
                  <View style={[styles.zoneIcon, { backgroundColor: colors.dangerLight }]}>
                    <AlertTriangle size={24} color={getDangerColor(zone.danger_level)} />
                  </View>
                  <View style={styles.zoneInfo}>
                    <View style={styles.zoneTitleRow}>
                      <Text style={[styles.zoneName, { color: colors.text }]}>Danger Zone</Text>
                      <View
                        style={[
                          styles.dangerBadge,
                          { backgroundColor: getDangerColor(zone.danger_level) + '20' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dangerBadgeText,
                            { color: getDangerColor(zone.danger_level) },
                          ]}
                        >
                          {zone.danger_level.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    {zone.description && (
                      <Text style={[styles.zoneAddress, { color: colors.textSecondary }]}>
                        {zone.description}
                      </Text>
                    )}
                    <Text style={[styles.incidentText, { color: colors.textLight }]}>
                      {zone.incident_count} incidents reported
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
                <AlertTriangle size={48} color={colors.textLight} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No danger zones reported yet
                </Text>
              </View>
            )
          )}
        </ScrollView>
      </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  zonesList: {
    flex: 1,
  },
  zoneCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 16,
    alignItems: 'center',
  },
  zoneIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneInfo: {
    flex: 1,
    gap: 4,
  },
  zoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
  },
  zoneType: {
    fontSize: 12,
    fontWeight: '600',
  },
  zoneAddress: {
    fontSize: 13,
    lineHeight: 18,
  },
  incidentText: {
    fontSize: 12,
    marginTop: 4,
  },
  dangerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dangerBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  navigateButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    padding: 48,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
