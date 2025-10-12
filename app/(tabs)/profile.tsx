import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { User, Phone, Mail, MapPin, Heart, Shield, LogOut, Moon, Sun, UserPlus, Settings } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { profile, signOut, updateProfile } = useAuth();
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    blood_group: profile?.blood_group || '',
    emergency_contact_name: profile?.emergency_contact_name || '',
    emergency_contact_phone: profile?.emergency_contact_phone || '',
    address: profile?.address || '',
  });

  const handleSave = async () => {
    setLoading(true);
    const { error } = await updateProfile(formData);
    setLoading(false);

    if (!error) {
      setEditMode(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)');
  };

  const profileSections = [
    {
      title: 'Personal Information',
      icon: User,
      fields: [
        { label: 'Full Name', value: profile?.full_name, key: 'full_name' },
        { label: 'Email', value: profile?.email, key: 'email', editable: false },
        { label: 'Phone', value: profile?.phone || 'Not set', key: 'phone' },
        { label: 'Blood Group', value: profile?.blood_group || 'Not set', key: 'blood_group' },
      ],
    },
    {
      title: 'Emergency Contact',
      icon: Phone,
      fields: [
        { label: 'Contact Name', value: profile?.emergency_contact_name || 'Not set', key: 'emergency_contact_name' },
        { label: 'Contact Phone', value: profile?.emergency_contact_phone || 'Not set', key: 'emergency_contact_phone' },
      ],
    },
    {
      title: 'Address',
      icon: MapPin,
      fields: [
        { label: 'Address', value: profile?.address || 'Not set', key: 'address' },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>{profile?.full_name}</Text>
          <Text style={styles.userEmail}>{profile?.email}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {editMode ? (
          <View style={styles.editContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Edit Profile</Text>

            {profileSections.map((section, sIndex) => (
              <View key={sIndex} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <section.icon size={20} color={colors.primary} />
                  <Text style={[styles.sectionHeaderText, { color: colors.text }]}>{section.title}</Text>
                </View>

                {section.fields.map((field, fIndex) => (
                  field.editable !== false && (
                    <View key={fIndex} style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{field.label}</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        value={formData[field.key as keyof typeof formData]}
                        onChangeText={(text) => setFormData({ ...formData, [field.key]: text })}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        placeholderTextColor={colors.textLight}
                      />
                    </View>
                  )
                ))}
              </View>
            ))}

            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: colors.card }]}
                onPress={() => setEditMode(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {profileSections.map((section, index) => (
              <View key={index} style={[styles.infoSection, { backgroundColor: colors.card }]}>
                <View style={styles.sectionHeader}>
                  <section.icon size={20} color={colors.primary} />
                  <Text style={[styles.sectionHeaderText, { color: colors.text }]}>{section.title}</Text>
                </View>

                {section.fields.map((field, fIndex) => (
                  <View key={fIndex} style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{field.label}</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{field.value}</Text>
                  </View>
                ))}
              </View>
            ))}

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.card }]}
              onPress={() => setEditMode(true)}
            >
              <User size={20} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.card }]}
              onPress={toggleTheme}
            >
              {theme === 'light' ? (
                <Moon size={20} color={colors.primary} />
              ) : (
                <Sun size={20} color={colors.primary} />
              )}
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </TouchableOpacity>

            <View style={[styles.roleCard, { backgroundColor: colors.primaryLight }]}>
              <Shield size={24} color={colors.primary} />
              <View style={styles.roleInfo}>
                <Text style={[styles.roleTitle, { color: colors.text }]}>Your Role</Text>
                <Text style={[styles.roleValue, { color: colors.primary }]}>
                  {profile?.role?.toUpperCase()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signOutButton, { backgroundColor: colors.dangerLight }]}
              onPress={handleSignOut}
            >
              <LogOut size={20} color={colors.danger} />
              <Text style={[styles.signOutButtonText, { color: colors.danger }]}>Sign Out</Text>
            </TouchableOpacity>
          </>
        )}
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
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  infoSection: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  roleValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {},
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
