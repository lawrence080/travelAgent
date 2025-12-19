import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type ProfileForm = {
  name: string;
  email: string;
  location: string;
  bio: string;
};

const initialProfile: ProfileForm = {
  name: 'Olivia Reese',
  email: 'olivia.reese@example.com',
  location: 'San Francisco, CA',
  bio: 'Adventure seeker who loves boutique stays, local food tours, and beach escapes.',
};

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileForm>(initialProfile);

  const handleChange = (key: keyof ProfileForm, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Manage your basic info</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={isEditing ? 'Save profile' : 'Edit profile'}
            onPress={handleToggleEdit}
            style={[styles.editButton, isEditing && styles.saveButton]}>
            <Ionicons name={isEditing ? 'checkmark' : 'pencil'} size={16} color="#FFFFFF" />
            <Text style={styles.editButtonLabel}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Info</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            {isEditing ? (
              <TextInput
                value={profile.name}
                onChangeText={(value) => handleChange('name', value)}
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="#94A3B8"
              />
            ) : (
              <Text style={styles.value}>{profile.name}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            {isEditing ? (
              <TextInput
                value={profile.email}
                onChangeText={(value) => handleChange('email', value)}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@email.com"
                placeholderTextColor="#94A3B8"
              />
            ) : (
              <Text style={styles.value}>{profile.email}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            {isEditing ? (
              <TextInput
                value={profile.location}
                onChangeText={(value) => handleChange('location', value)}
                style={styles.input}
                placeholder="City, Country"
                placeholderTextColor="#94A3B8"
              />
            ) : (
              <Text style={styles.value}>{profile.location}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Bio</Text>
            {isEditing ? (
              <TextInput
                value={profile.bio}
                onChangeText={(value) => handleChange('bio', value)}
                style={[styles.input, styles.textArea]}
                multiline
                placeholder="Tell us about your travel style"
                placeholderTextColor="#94A3B8"
              />
            ) : (
              <Text style={styles.value}>{profile.bio}</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF7F1',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#475467',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF8A4C',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    shadowColor: '#F2C6A8',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  saveButton: {
    backgroundColor: '#16A34A',
  },
  editButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFCF8',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    shadowColor: '#F2D1AE',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8F9BB3',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#F3E8DD',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
});
