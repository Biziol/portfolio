import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import regularFont from "@fontsource/inter/files/inter-latin-400-normal.woff?url";
import boldFont from "@fontsource/inter/files/inter-latin-600-normal.woff?url";
import { cvProfessionalSummary } from "../../data/about";
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
    paddingTop: 28, paddingBottom: 42, paddingHorizontal: 30,
    backgroundColor: "#fbf9fa", color: "#16181d",
  },
  header: { flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 12, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: "#f56868" },
  photo: { width: 64, height: 64, borderRadius: 32, objectFit: "cover", borderWidth: 2, borderColor: "#f56868" },
  intro: { flex: 1 },
  name: { fontSize: 26, fontWeight: 600, marginBottom: 5 },
  role: { fontSize: 10, color: "#b83e3e", fontWeight: 600 },
  title: { fontSize: 13, fontWeight: 600, marginTop: 12, marginBottom: 7, color: "#b83e3e" },
  columns: { flexDirection: "row", alignItems: "flex-start" },
  sidebar: { width: 164, marginRight: -164, flexShrink: 0, backgroundColor: "#f2edef", borderRadius: 8, padding: 12, fontSize: 8 },
  // Keep the right column aligned even after the sidebar ends on a previous page.
  main: { flex: 1, minWidth: 0, marginLeft: 184 },
  sidebarTitle: { fontSize: 10, fontWeight: 600, color: "#b83e3e", marginBottom: 6, marginTop: 9 },
  sidebarText: { color: "#52525b", marginBottom: 5 },
  paragraph: { color: "#52525b", marginBottom: 5 },
  narrative: { marginBottom: 4 },
  contact: { marginBottom: 5 },
  label: { color: "#52525b", fontWeight: 600, fontSize: 7, marginBottom: 2 },
  link: { color: "#16181d", textDecoration: "none", flexShrink: 1 },
  entry: { borderLeftWidth: 2, borderLeftColor: "#f56868", paddingLeft: 12, marginBottom: 9 },
  entryTitle: { fontSize: 11, fontWeight: 600 },
  meta: { color: "#52525b", fontSize: 8, marginBottom: 4 },
  organization: { fontWeight: 600, marginTop: 2 },
  bullet: { flexDirection: "row", marginTop: 3 },
  dot: { width: 11, color: "#b83e3e" },
  detail: { flex: 1 },
  qualification: { marginTop: 5, fontWeight: 600 },
  skillGroup: { marginBottom: 8 },
  skillLabel: { fontWeight: 600, fontSize: 7, color: "#b83e3e", marginBottom: 3 },
  consent: { marginTop: 8, paddingTop: 4, borderTopWidth: 0.5, borderTopColor: "#dddddf", fontSize: 7, color: "#52525b" },
  signatureRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 6 },
  signatureImage: { width: 110, height: 32, objectFit: "contain" },
  footer: { position: "absolute", bottom: 20, height: 18, left: 30, right: 30, textAlign: "right", fontSize: 7, color: "#52525b", borderTopWidth: 0.5, borderTopColor: "#dddddf", paddingTop: 7 },
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
          </View>
        </View>
        <View style={styles.columns}>
          <View style={styles.sidebar}>
            <Text style={[styles.sidebarTitle, { marginTop: 0 }]} minPresenceAhead={45}>Contatti</Text>
            <View style={styles.contact} wrap={false}>
              <Text style={styles.label}>Portfolio</Text>
              <Link src={profile.portfolioUrl} style={styles.link}>{profile.portfolioUrl}</Link>
            </View>
            {profile.contacts.map((contact) => (
              <View key={contact.id} style={styles.contact} wrap={false}>
                <Text style={styles.label}>{contact.field}</Text>
                <Link src={contact.href} style={styles.link}>{contact.value}</Link>
              </View>
            ))}
            {skills.length > 0 && (
              <>
                <Text style={styles.sidebarTitle} minPresenceAhead={45}>Competenze tecniche</Text>
                {skills.map((group) => (
                  <View key={group.field} style={styles.skillGroup}>
                    <Text style={styles.skillLabel} minPresenceAhead={20}>{group.field}</Text>
                    <Text>{group.names.join(" • ")}</Text>
                  </View>
                ))}
              </>
            )}
            <Text style={styles.sidebarTitle} minPresenceAhead={45}>Informazioni personali</Text>
            <View wrap={false}>
              <Text style={styles.sidebarText}>Disponibilità: {profile.disponibilità}</Text>
              <Text style={styles.sidebarText}>Patenti: {profile.patenti.join(", ")}</Text>
              <Text style={styles.sidebarText}>Nascita: {profile.birthDate}</Text>
              <Text style={styles.sidebarText}>Nazionalità: {profile.nationality}</Text>
            </View>
            <Text style={styles.sidebarTitle} minPresenceAhead={35}>Collaborazioni</Text>
            {profile.collaborations.map((collaboration) => (
              <Text key={collaboration} style={styles.sidebarText}>{collaboration}</Text>
            ))}
          </View>
          <View style={styles.main}>
            <View style={styles.narrative}>
              <Text style={[styles.title, { marginTop: 0 }]} minPresenceAhead={55}>Profilo professionale</Text>
              <Text style={styles.paragraph} orphans={2} widows={2}>{cvProfessionalSummary}</Text>
            </View>
            {renderEntries("Esperienza lavorativa", work)}
            {renderEntries("Istruzione e formazione", training)}
          </View>
        </View>
        <View style={styles.consent} wrap={false}>
          <Text>
            Autorizzo il trattamento dei miei dati personali presenti nel CV ai sensi dell’art. 13 d. lgs. 30 giugno 2003 n. 196 - “Codice in materia di protezione dei dati personali” e dell’art. 13 GDPR 679/16 - “Regolamento europeo sulla protezione dei dati personali”.
          </Text>
          {data.signature && (
            <View style={styles.signatureRow}>
              <Text>Data: {data.signature.signedOn.split("-").reverse().join("/")}</Text>
              <View>
                <Image src={data.signature.imageDataUrl} style={styles.signatureImage} />
                <Text style={{ textAlign: "center", marginTop: 2 }}>{profile.name}</Text>
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
