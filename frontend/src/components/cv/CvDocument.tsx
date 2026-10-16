import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import regularFont from "@fontsource/inter/files/inter-latin-400-normal.woff?url";
import boldFont from "@fontsource/inter/files/inter-latin-600-normal.woff?url";
import type { CvData, CvEntry } from "../../interfaces/CvData";

Font.register({
  family: "Inter",
  fonts: [
    { src: regularFont, fontWeight: 400 },
    { src: boldFont, fontWeight: 600 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter", fontSize: 9,
    paddingTop: 34, paddingBottom: 46, paddingHorizontal: 38,
    backgroundColor: "#fbf9fa", color: "#16181d",
  },
  header: { flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 12, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: "#f56868" },
  photo: { width: 68, height: 68, borderRadius: 34, objectFit: "cover", borderWidth: 2, borderColor: "#f56868" },
  intro: { flex: 1 },
  name: { fontSize: 26, fontWeight: 600, marginBottom: 5 },
  role: { fontSize: 10, color: "#b83e3e", fontWeight: 600 },
  bio: { marginTop: 8, color: "#52525b" },
  title: { fontSize: 13, fontWeight: 600, marginTop: 12, marginBottom: 7, color: "#b83e3e" },
  contactBox: { backgroundColor: "#ffffff", borderRadius: 8, padding: 12, borderWidth: 0.5, borderColor: "#dddddf" },
  contact: { flexDirection: "row", marginBottom: 3 },
  label: { width: 65, color: "#52525b", fontWeight: 600 },
  link: { color: "#16181d", textDecoration: "none", flexShrink: 1 },
  entry: { borderLeftWidth: 2, borderLeftColor: "#f56868", paddingLeft: 12, marginBottom: 9 },
  entryTitle: { fontSize: 11, fontWeight: 600 },
  meta: { color: "#52525b", fontSize: 8, marginBottom: 4 },
  organization: { fontWeight: 600, marginTop: 2 },
  bullet: { flexDirection: "row", marginTop: 3 },
  dot: { width: 11, color: "#b83e3e" },
  detail: { flex: 1 },
  qualification: { marginTop: 5, fontWeight: 600 },
  skillGroup: { flexDirection: "row", marginBottom: 6 },
  skillLabel: { width: 80, fontWeight: 600, fontSize: 8, color: "#b83e3e" },
  footer: { position: "absolute", bottom: 20, height: 18, left: 38, right: 38, textAlign: "right", fontSize: 7, color: "#52525b", borderTopWidth: 0.5, borderTopColor: "#dddddf", paddingTop: 7 },
});

function renderEntries(title: string, entries: CvEntry[]) {
  if (!entries.length) return null;
  return (
    <>
      <Text style={styles.title} minPresenceAhead={85}>{title}</Text>
      {entries.map((entry) => (
        <View key={entry.id} style={styles.entry}>
          <View wrap={false}>
            <Text style={styles.entryTitle}>{entry.title}</Text>
            <Text style={styles.organization}>{entry.organization}</Text>
            <Text style={styles.meta}>
              {entry.period}{entry.location ? ` | ${entry.location}` : ""}
            </Text>
            {entry.website && <Link src={entry.website} style={styles.link}>{entry.website}</Link>}
          </View>
          {entry.details.map((detail, index) => (
            <View key={index} style={styles.bullet}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.detail} orphans={2} widows={2}>{detail}</Text>
            </View>
          ))}
          {entry.qualification && <Text style={styles.qualification}>{entry.qualification}</Text>}
        </View>
      ))}
    </>
  );
}

export default function createCvDocument(data: CvData) {
  const { profile, skills, work, training } = data;
  return (
    <Document title={`Curriculum Vitae — ${profile.name}`} author={profile.name} language="it-IT">
      <Page size="A4" style={styles.page}>
        <Text style={styles.footer} fixed
          render={({ pageNumber, totalPages }) => `${profile.name} · Curriculum Vitae     ${pageNumber} / ${totalPages}`}
        />
        <View style={styles.header} wrap={false}>
          <Image src={profile.photo} style={styles.photo} />
          <View style={styles.intro}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.role}>{profile.role}</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        </View>
        <View style={styles.contactBox} wrap={false}>
          <View style={styles.contact}>
            <Text style={styles.label}>Portfolio</Text>
            <Link src={profile.portfolioUrl} style={styles.link}>{profile.portfolioUrl}</Link>
          </View>
          {profile.contacts.map((contact) => (
            <View key={contact.id} style={styles.contact}>
              <Text style={styles.label}>{contact.field}</Text>
              <Link src={contact.href} style={styles.link}>{contact.value}</Link>
            </View>
          ))}
        </View>
        {renderEntries("Esperienza lavorativa", work)}
        {renderEntries("Istruzione e formazione", training)}
        {skills.length > 0 && (
          <>
            <Text style={styles.title} minPresenceAhead={45}>Competenze tecniche</Text>
            {skills.map((group) => (
              <View key={group.field} style={styles.skillGroup}>
                <Text style={styles.skillLabel}>{group.field}</Text>
                <Text style={styles.detail}>{group.names.join(" • ")}</Text>
              </View>
            ))}
          </>
        )}
        <View wrap={false}>
          <Text style={styles.title}>Informazioni aggiuntive</Text>
          <Text>Disponibilità: {profile.disponibilità} | Patenti: {profile.patenti.join(", ")}</Text>
          <Text>Nascita: {profile.birthDate} | Nazionalità: {profile.nationality}</Text>
          <Text style={styles.bio}>Collaborazioni: {profile.collaborations.join(" • ")}</Text>
        </View>
      </Page>
    </Document>
  );
}
