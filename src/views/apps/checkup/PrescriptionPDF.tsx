import { getCheckup } from '@/server/hooks/checkup';
import { ReferencesEntityType } from '@/utils/db.type';

import InterRegular from '@/assets/fonts/Inter-Regular.ttf';
import InterBold from '@/assets/fonts/Inter-Bold.ttf';
import InterItalic from '@/assets/fonts/Inter-Italic.ttf';

import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { TreatmentDtoSchemaType } from '@/server/schema/checkup';
import moment from 'moment';
import { PhysicianProfileDtoSchemaType } from '@/server/schema/user';

const styles = StyleSheet.create({
  body: {
    fontFamily: 'InteRegular',
    fontSize: 5,
    paddingHorizontal: 10
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '2 solid #000',
    padding: 4
  },
  footer: {
    display: 'flex',
    flexDirection: 'column'
  },
  fontBold: {
    fontFamily: 'InterBold'
  },
  underline: {
    textDecoration: 'underline'
  },
  clinicInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  patientInfo: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 4,
    paddingTop: 4
  },
  content: {
    display: 'flex',
    flexDirection: 'column'
  },
  treatmentItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 3
  },
  bulletPoint: {
    fontSize: 10,
    marginRight: 4
  },
  medicineSignaContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  medicine: {
    fontFamily: 'InterBold',
    textTransform: 'uppercase',
    fontSize: 5,
    marginBottom: 1
  },
  quantity: {
    fontFamily: 'InterBold',
    fontSize: 6,
    marginBottom: 1,
    marginRight: 2
  },
  signa: {
    fontFamily: 'InterItalic',
    textTransform: 'capitalize',
    fontSize: 6
  }
});

Font.register({
  family: 'InteRegular',
  src: InterRegular
});

Font.register({
  family: 'InterBold',
  src: InterBold
});

Font.register({
  family: 'InterItalic',
  src: InterItalic
});

const TreatmentList = ({ children }: { children: React.ReactNode }) => {
  return <View>{children}</View>;
};

const TreatmentItem = ({ medicine, signa, quantity }: { medicine?: string; signa: string; quantity: number }) => {
  return (
    <View style={styles.treatmentItemContainer}>
      <View style={styles.bulletPoint}>
        <Text>•</Text>
      </View>
      <View style={styles.medicineSignaContainer}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={styles.quantity}>[{quantity}x]</Text>
          <Text style={styles.medicine}>{medicine}</Text>
        </View>
        <View style={styles.signa}>
          <Text>{signa}</Text>
        </View>
      </View>
    </View>
  );
};

const PrescriptionPDF = ({ id, medicinesData }: { id: number; medicinesData: ReferencesEntityType[] }) => {
  const checkupData = getCheckup({ id });

  const treatments = checkupData?.treatments
    ? (JSON.parse(JSON.stringify(checkupData.treatments)) as TreatmentDtoSchemaType[])
    : [];

  const physicianProfile = JSON.parse(
    JSON.stringify(checkupData?.physician.profile?.roleProfile)
  ) as PhysicianProfileDtoSchemaType;

  return (
    <Document>
      {/* size = 4.25 inc x 5.5 inc -> 306 points x 396 points  */}
      <Page style={styles.body} size={{ width: 306, height: 396 }}>
        {/* header */}
        <View style={styles.header} fixed>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRight: '2 solid #000',
                alignItems: 'flex-end',
                paddingHorizontal: 3
              }}
            >
              <Text style={[styles.fontBold, { fontSize: 8 }]}>CONFLUENCE</Text>
              <Text style={{ fontSize: 4 }}>HEALTH & WELLNESS PRODUCTS</Text>
            </View>
            <View style={{ paddingHorizontal: 3, paddingVertical: 4 }}>
              <Text style={{ fontSize: 10 }}>Life Extension Medical Clinic</Text>
            </View>
          </View>
          <View style={{ alignSelf: 'flex-end', paddingVertical: 3 }}>
            <Text style={{ fontFamily: 'Times-Bold', fontSize: 6, color: 'red' }}>{physicianProfile?.deaNumber}</Text>
          </View>
          <View style={styles.clinicInfo}>
            <View style={{ display: 'flex', flexDirection: 'column', width: '70%', marginRight: 2 }}>
              <Text wrap>{checkupData?.clinic.address}</Text>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ width: '17%' }}>Contact Nos. </Text>
                <Text wrap style={{ width: '83%' }}>
                  {checkupData?.clinic.contactNumber.map((c, i) => {
                    const lastIndex = checkupData.clinic.contactNumber.length - 1;

                    if (i === lastIndex) return c;
                    else return `${c} | `;
                  })}
                </Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', width: '25%' }}>
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ width: '38%' }}>Clinic Hrs: </Text>
                <Text wrap style={{ flex: 1, width: '55%' }}>
                  {checkupData?.clinic.daysOpen.replace(/,|-/g, match => {
                    if (match === ',') return ' , ';
                    else if (match === '-') return ' - ';
                    else return ' ';
                  })}
                </Text>
              </View>
              <Text>
                {moment(checkupData?.clinic.openingTime).format('LT')} -{' '}
                {moment(checkupData?.clinic.closingTime).format('LT')}
              </Text>
            </View>
          </View>
        </View>
        {/* patient info */}
        <View style={styles.patientInfo} fixed>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '70%', marginRight: 2 }}></View>
            <View
              style={{ alignSelf: 'center', display: 'flex', flexDirection: 'row', width: '25%', paddingBottom: 3 }}
            >
              <Text>Date: </Text>
              <Text style={styles.underline}>{moment(new Date()).format('LL')}</Text>
            </View>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ display: 'flex', flexDirection: 'column', width: '70%', marginRight: 2 }}>
              <View style={{ display: 'flex', flexDirection: 'row', width: '100%', paddingBottom: 3 }}>
                <Text style={{ width: '10%' }}>Patient: </Text>
                <Text wrap style={[styles.underline, { width: '90%' }]}>
                  {checkupData?.patient.firstName}{' '}
                  {checkupData?.patient.middleInitial && checkupData?.patient.middleInitial + '.'}{' '}
                  {checkupData?.patient.lastName}
                </Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ width: '12%' }}>Address: </Text>
                <Text wrap style={[styles.underline, { width: '88%' }]}>
                  {checkupData?.patient.address}
                </Text>
              </View>
            </View>

            <View style={{ display: 'flex', flexDirection: 'column', width: '25%' }}>
              <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 3 }}>
                <Text>Age: </Text>
                <Text style={styles.underline}>{checkupData?.patient.age}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text>Sex: </Text>
                <Text style={styles.underline}>{checkupData?.patient.gender.name}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* prescription content */}
        <View style={styles.content}>
          <View fixed>
            <Text style={{ fontSize: 30, marginTop: -5 }}>℞</Text>
          </View>
          <View style={{ height: 'auto', marginVertical: 'auto' }}>
            <TreatmentList>
              {treatments &&
                treatments.length > 0 &&
                treatments.map((t, i) => (
                  <TreatmentItem
                    key={i}
                    medicine={
                      !!medicinesData && medicinesData.length > 0
                        ? medicinesData.find(ref => ref.id === t.medicineId)?.name
                        : ''
                    }
                    quantity={t.quantity}
                    signa={t.signa}
                  />
                ))}
            </TreatmentList>
          </View>
        </View>
        {/* footer */}
        <View style={[styles.footer, { paddingTop: 15, marginTop: 'auto' }]}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 4,
              alignItems: 'flex-end'
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'column', width: '65%' }}>
              <Text style={[styles.fontBold, { paddingBottom: 2 }]}>Special Instructions: </Text>
              <Text>( ) low salt, low fat diet</Text>
              <Text>( ) avoid high sugar foods</Text>
              <Text>( ) fiber rich diet (fruits/vegetables)</Text>
              <Text>( ) increase oral fluid intake</Text>
              <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 2 }}>
                <Text>
                  ({checkupData?.dietaryAdviseGiven && checkupData?.dietaryAdviseGiven !== 'N/A' ? '✓' : ' '}){' '}
                </Text>
                <Text style={styles.underline} wrap>
                  {checkupData?.dietaryAdviseGiven ? checkupData?.dietaryAdviseGiven : 'N/A'}
                </Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '30%' }}>
              <View>
                <Text wrap style={[styles.fontBold, { fontSize: 7, paddingBottom: 2 }]}>
                  {checkupData?.physician.firstName.toUpperCase() + ' '}
                  {checkupData?.physician.middleInitial &&
                    checkupData?.physician.middleInitial.toUpperCase() + '.'}{' '}
                  {checkupData?.physician.lastName.toUpperCase()}, {physicianProfile?.qualification.toUpperCase()}
                </Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 2 }}>
                <Text>Licence No. </Text>
                <Text style={styles.underline}>{physicianProfile?.licenseNumber}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 2 }}>
                <Text>PTR No. </Text>
                <Text style={styles.underline}>{physicianProfile?.ptrNumber}</Text>
              </View>
            </View>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 2 }}>
            <Text style={styles.fontBold}>Follow up: </Text>
            <Text style={styles.underline}>
              {checkupData?.followUp ? moment(checkupData?.followUp).format('LL') : 'N/A'}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PrescriptionPDF;
