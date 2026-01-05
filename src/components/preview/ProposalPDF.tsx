import { Document, Page, Text, View, StyleSheet, Image, Svg, Path, Font } from '@react-pdf/renderer';
import { type JSONContent } from '@tiptap/react';
import logoAsset from '../../assets/best-digital-marketing-agency-in-pune.jpg';

// Register Emoji Source for supporting Emojis in PDF
Font.registerEmojiSource({
  format: "png",
  url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/",
});

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch (e) {
    return dateStr;
  }
};

const BrandColors = {
  HeaderIcon: '#4b5563', 
  WhatsApp: '#25D366',
  Instagram: '#E4405F',
  Facebook: '#1877F2',
  LinkedIn: '#0077B5',
  X: '#000000',
  Location: '#ef4444',
  YouTube: '#FF0000',
};

const IconPaths = {
  Phone: "M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5C20.55,15.5 21,15.95 21,16.5V20C21,20.55 20.55,21 20,21C10.61,21 3,13.39 3,4C3,3.45 3.45,3 4,3H7.5C8.05,3 8.5,3.45 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z",
  Email: "M20,4H4C2.9,4 2,4.9 2,6V18C2,19.1 2.9,20 4,20H20C21.1,20 22,19.1 22,18V6C22,4.9 21.1,4 20,4M20,8L12,13L4,8V6L12,11L20,6V8Z",
  Globe: "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,14.41 5.07,16.57 6.76,18.04C7,17.8 7.35,17.5 7.7,17.15C8.25,16.63 8.8,16.1 9,15.75C9.2,15.4 9.35,14.65 9.47,13.62C9.5,13.19 9.5,12.75 9.5,12.31C9.5,11.87 9.5,11.43 9.47,11C9.35,9.97 9.2,9.22 9,8.87C8.8,8.52 8.25,7.99 7.7,7.47C7.35,7.14 7,6.84 6.76,6.6C5.07,8.07 4,10.23 4,12.64C4,15.05 5.07,17.21 6.76,18.68C8,20.12 9.87,21 12,21C14.13,21 16,20.12 17.24,18.68C18.93,17.21 20,15.05 20,12.64C20,10.23 18.93,8.07 17.24,6.6C17,6.84 16.65,7.14 16.3,7.47C15.75,7.99 15.2,8.52 15,8.87C14.8,9.22 14.65,9.97 14.53,11C14.5,11.43 14.5,11.87 14.5,12.31C14.5,12.75 14.5,13.19 14.53,13.62C14.65,14.65 14.8,15.4 15,15.75C15.2,16.1 15.75,16.63 16.3,17.15C16.65,17.5 17,17.8 17.24,18.04C18.93,16.57 20,14.41 20,12C20,9.59 18.93,7.43 17.24,5.96C16,4.52 14.13,3.64 12,3.64C9.87,3.64 8,4.52 6.76,5.96C5.07,7.43 4,9.59 4,12",
  Location: "M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5Z",
  LinkedIn: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 1 1.68-1.68c.93 0 1.68.75 1.68 1.68a1.69 1.69 0 0 1-1.69 1.69a1.68 1.68 0 0 1-1.67-1.69m1.39 9.94v-8.37H5.5v8.37h2.77z",
  Facebook: "M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z",
  Instagram: "M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2C22,19.4 19.4,22 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8C2,4.6 4.6,2 7.8,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M18,5.75A0.75,0.75 0 0,0 17.25,6.5A0.75,0.75 0 0,0 18,7.25A0.75,0.75 0 0,0 18.75,6.5A0.75,0.75 0 0,0 18,5.75Z",
  X: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z",
  WhatsApp: "M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01-1.87-1.88-4.36-2.91-7.01-2.91zm0 1.67c2.2 0 4.26.86 5.82 2.42s2.42 3.62 2.42 5.82c0 4.54-3.7 8.23-8.24 8.23-1.38 0-2.72-.35-3.9-1.03l-.3-.17-3.13.82.83-3.04-.18-.28c-.72-1.14-1.1-2.47-1.1-3.83 0-4.54 3.7-8.23 8.25-8.23h-.02zM8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.21.89 2.38 1.01 2.54s2.52 2.47 3.53 2.82c.78.3 1.04.36 1.38.36.36 0 1.11-.39 1.26-.85.16-.45.16-.85.11-.93s-.17-.12-.36-.22-.92-.44-1.09-.5c-.17-.06-.3-.09-.43.1s-.41.51-.52.64c-.12.14-.24.15-.43.05a5.45 5.45 0 0 1-1.93-1.2c-.55-.49-.92-1.09-1.03-1.27s-.01-.27.09-.37l.28-.33c.09-.11.12-.19.19-.34.06-.16.03-.28-.02-.39s-.35-.89-.5-1.27c-.14-.35-.29-.31-.4-.31s-.23 0-.36 0z",
  YouTube: "M10 15L15.19 12L10 9V15ZM21.56 7.17C21.69 7.64 21.78 8.27 21.84 9.07C21.91 9.87 21.94 10.66 21.94 11.44V12.56C21.94 13.34 21.91 14.13 21.84 14.93C21.78 15.73 21.69 16.36 21.56 16.83C21.31 17.73 20.73 18.31 19.83 18.56C19.36 18.69 18.5 18.78 17.18 18.84C15.88 18.91 14.69 18.94 13.59 18.94L13.5 19H10.5L10.41 18.94C9.31 18.94 8.12 18.91 6.82 18.84C5.5 18.78 4.64 18.69 4.17 18.56C3.27 18.31 2.69 17.73 2.44 16.83C2.31 16.36 2.22 15.73 2.16 14.93C2.09 14.13 2.06 13.34 2.06 12.56V11.44C2.06 10.66 2.09 9.87 2.16 9.07C2.22 8.27 2.31 7.64 2.44 7.17C2.69 6.27 3.27 5.69 4.17 5.44C4.64 5.31 5.5 5.22 6.82 5.16C8.12 5.09 9.31 5.06 10.41 5.06L10.5 5H13.5L13.59 5.06C14.69 5.06 15.88 5.09 17.18 5.16C18.5 5.22 19.36 5.31 19.83 5.44C20.73 5.69 21.31 6.27 21.56 7.17Z"
};

const Icon = ({ path, color, size = 12 }: { path: string, color: string, size?: number }) => (
  <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path fill={color} d={path} />
  </Svg>
);

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    paddingTop: 115,
    paddingBottom: 100, // Increased padding to prevent footer overlap
    paddingHorizontal: 0,
    margin: 0,
  },
  pageQuotation: {
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    paddingTop: 115,
    paddingBottom: 40,
    paddingHorizontal: 0,
    margin: 0,
  },
  header: {
    position: 'absolute',
    top: 0, 
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    width: 160,
    height: 'auto',
  },
  contactInfo: {
    alignItems: 'flex-start',
    gap: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 9,
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0, 
    left: 0,
    right: 0,
    height: 70, 
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconWrapper: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLocation: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footerSocials: {
    flexDirection: 'row',
    gap: 15,
  },
  socialIconWrapper: {
    width: 26,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentArea: {
    paddingHorizontal: 45,
  },
  title: {
    fontSize: 22, // Reduced from 26
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4, 
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11, // Reduced from 13
    marginBottom: 20, 
    color: '#4b5563',
    fontWeight: 'normal',
    lineHeight: 1.4,
  },
  infoSection: {
    marginBottom: 20, 
    backgroundColor: '#ffffff', 
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
  },
  infoValue: {
    fontSize: 11,
    color: '#374151',
  },
  h1: { fontSize: 18, marginBottom: 8, fontWeight: 'bold', color: '#000000', marginTop: 12 },
  h2: { fontSize: 15, marginBottom: 6, fontWeight: 'bold', color: '#111827', marginTop: 10 },
  p: { fontSize: 11, marginBottom: 5, lineHeight: 1.4, color: '#374151', textAlign: 'justify' },
  list: { marginLeft: 15, marginBottom: 5 },
  listItem: { flexDirection: 'row', marginBottom: 1 },
  bullet: { width: 15, fontSize: 11, color: '#000000' },
  listContent: { flex: 1, fontSize: 11, color: '#374151' },
});

const PDFNode = ({ node, themeColor, isSignature }: { node: JSONContent, themeColor: string, isSignature?: boolean }) => {
  if (!node) return null;

  if (node.type === 'text') {
    const style: any = {};
    if (node.marks) {
      node.marks.forEach((m: any) => {
        if (m.type === 'bold') style.fontWeight = 'bold';
        if (m.type === 'italic') style.fontStyle = 'italic';
        if (m.type === 'underline') style.textDecoration = 'underline';
        if (m.type === 'link') style.color = themeColor;
      });
    }
    return <Text style={style}>{node.text}</Text>;
  }

  if (node.type === 'paragraph') {
    return (
      <View style={styles.p}>
        <Text>
          {node.content?.map((c, i) => <PDFNode key={i} node={c} themeColor={themeColor} />)}
        </Text>
      </View>
    );
  }

  if (node.type === 'heading') {
    const level = node.attrs?.level || 1;
    const hStyle = level === 1 ? styles.h1 : styles.h2;
    return (
      <Text style={hStyle}>
        {node.content?.map((c, i) => <PDFNode key={i} node={c} themeColor={themeColor} />)}
      </Text>
    );
  }

  if (node.type === 'bulletList' || node.type === 'orderedList') {
    return (
      <View style={styles.list}>
        {node.content?.map((c, i) => <PDFNode key={i} node={c} themeColor={themeColor} />)}
      </View>
    );
  }

  if (node.type === 'listItem') {
    return (
      <View style={styles.listItem}>
        <Text style={[styles.bullet, { color: themeColor }]}>• </Text>
        <View style={styles.listContent}>
          {node.content?.map((c, i) => <PDFNode key={i} node={c} themeColor={themeColor} />)}
        </View>
      </View>
    );
  }

  if (node.type === 'table') {
      return (
          <View style={{ marginBottom: 10, width: '100%', borderLeft: 1, borderTop: 1, borderColor: '#e5e7eb' }}>
             {node.content?.map((c, i) => <PDFNode key={i} node={c} themeColor={themeColor} />)}
          </View>
      );
  }

  if (node.type === 'tableRow') {
      return (
          <View style={{ flexDirection: 'row' }}>
             {node.content?.map((c, i) => <PDFNode key={i} node={c} themeColor={themeColor} isSignature={isSignature} />)}
          </View>
      );
  }

  if (node.type === 'tableHeader' || node.type === 'tableCell') {
      // If inside a signature table, remove borders
      const cellStyle: any = { 
          flex: 1, 
          padding: 5, 
          backgroundColor: node.type === 'tableHeader' ? '#f3f4f6' : 'transparent' 
      };
      
      if (!isSignature) {
          cellStyle.borderRight = 1;
          cellStyle.borderBottom = 1;
          cellStyle.borderColor = '#e5e7eb';
      }

      return (
         <View style={cellStyle}>
            {node.content?.map((c, i) => <PDFNode key={i} node={c} themeColor={themeColor} isSignature={isSignature} />)}
         </View>
      );
  }

  if (node.type === 'hardBreak') {
    return <Text>{"\n"}</Text>;
  }

  return null;
};

import type { VisualData } from "../types";

export const ProposalDocument = ({ 
  content, clientName, themeColor = '#2563eb', 
  date, validity, visualData, isReplicaActive, documentType
}: { 
  content: JSONContent, clientName: string, themeColor: string, 
  date: string, validity: string, visualData?: VisualData | null, isReplicaActive?: boolean,
  documentType?: 'proposal' | 'quotation'
}) => {
  const nodes = content?.content || [];
  const displayDate = formatDisplayDate(date);
  
  // Use visual data if replica mode is active
  const activeHeaderColor = (isReplicaActive && visualData?.primaryColor) ? visualData.primaryColor : '#000000';
  const activeSecondaryColor = (isReplicaActive && visualData?.secondaryColor) ? visualData.secondaryColor : '#4b5563';
  
  return (
    <Document title={`${clientName || 'Proposal'}.pdf`}>
      <Page size="A4" style={documentType === 'quotation' ? styles.pageQuotation : styles.page}>
        <View style={[styles.header, { backgroundColor: activeHeaderColor }]} fixed>
          <Image src={logoAsset} style={styles.logo} />
          
          {/* If Replica Mode has Header Text, display it instead of static contacts */}
          {isReplicaActive && visualData?.headerText ? (
              <View style={[styles.contactInfo, { maxWidth: 200 }]}>
                    {visualData.headerText.split(/[|\n]/).map((line, i) => (
                        <Text key={i} style={[styles.contactText, { fontSize: 9, marginBottom: 2 }]}>{line.trim()}</Text>
                    ))}
              </View>
          ) : (
              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <View style={styles.iconWrapper}><Icon path={IconPaths.Phone} color={BrandColors.HeaderIcon} size={9} /></View>
                  <Text style={styles.contactText}>+91 9822857421</Text>
                </View>
                {/* ... other default contacts ... */}
                <View style={styles.contactItem}>
                    <View style={styles.iconWrapper}><Icon path={IconPaths.Email} color={BrandColors.HeaderIcon} size={9} /></View>
                    <Text style={styles.contactText}>vvmohol@gmail.com</Text>
                </View>
                <View style={styles.contactItem}>
                    <View style={styles.iconWrapper}><Icon path={IconPaths.Email} color={BrandColors.HeaderIcon} size={9} /></View>
                    <Text style={styles.contactText}>official@thedigitechsolutions.com</Text>
                </View>
                 <View style={styles.contactItem}>
                    <View style={styles.iconWrapper}><Icon path={IconPaths.Globe} color={BrandColors.HeaderIcon} size={9} /></View>
                    <Text style={styles.contactText}>https://thedigitechsolutions.com/</Text>
                </View>
              </View>
          )}
        </View>

        <View style={styles.contentArea}>
          <Text style={[styles.title, { color: activeHeaderColor }]}>
            {documentType === 'quotation' 
              ? (clientName ? `${clientName.toUpperCase()} QUOTATION` : 'COMMERCIAL QUOTATION')
              : (clientName ? `${clientName.toUpperCase()} PROPOSAL` : 'PROJECT PROPOSAL')
            }
          </Text>
          <Text style={[styles.subtitle, { color: activeSecondaryColor }]}>Innovating your digital future with excellence</Text>
          
          {documentType !== 'quotation' && (
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoValue}>
                  <Text style={styles.infoLabel}>Prepared For: </Text>
                  {clientName || '[Enter Client Name]'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoValue}>
                  <Text style={styles.infoLabel}>Date: </Text>
                  {displayDate}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoValue}>
                  <Text style={styles.infoLabel}>Validity: </Text>
                  {validity}
                </Text>
              </View>
            </View>
          )}

          <View>
            {nodes.map((n, i) => <PDFNode key={i} node={n} themeColor={isReplicaActive ? activeHeaderColor : themeColor} />)}
          </View>
        </View>

        {documentType !== 'quotation' && (
        <View style={[styles.footer, { backgroundColor: activeHeaderColor }]} fixed>
           {isReplicaActive && visualData?.footerText ? (
                <View style={{ flex: 1, alignItems: 'center' }}>
                     <Text style={[styles.contactText, { textAlign: 'center' }]}>{visualData.footerText}</Text>
                </View>
           ) : (
              <>
                  <View style={styles.footerLeft}>
                    <View style={styles.locationIconWrapper}><Icon path={IconPaths.Location} color={BrandColors.Location} size={14} /></View>
                    <Text style={styles.footerLocation}>Neo 95 Ravet</Text>
                  </View>
                  <View style={styles.footerSocials}>
                    <View style={styles.socialIconWrapper}><Icon path={IconPaths.Facebook} color={BrandColors.Facebook} size={16} /></View>
                    <View style={styles.socialIconWrapper}><Icon path={IconPaths.Instagram} color={BrandColors.Instagram} size={16} /></View>
                    <View style={styles.socialIconWrapper}><Icon path={IconPaths.WhatsApp} color={BrandColors.WhatsApp} size={16} /></View>
                    <View style={styles.socialIconWrapper}><Icon path={IconPaths.YouTube} color={BrandColors.YouTube} size={16} /></View>
                    <View style={styles.socialIconWrapper}><Icon path={IconPaths.X} color={BrandColors.X} size={14} /></View>
                  </View>
              </>
           )}
        </View>
        )}


        <Text 
          style={{ position: 'absolute', bottom: 85, right: 45, fontSize: 8, color: '#9ca3af' }} 
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} 
        />
      </Page>
    </Document>
  );
};
