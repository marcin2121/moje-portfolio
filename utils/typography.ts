export function fixOrphans(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  let result = text;
  
  // Szukamy pojedynczych i podwójnych liter/cyfr (np. i, w, z, o, 5, do, na)
  // i łączymy je z kolejnym słowem twardą spacją (\u00A0).
  const orphanRegex = /(^|[ \(\[\-\xa0])([a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]{1,2})[ ]/g;
  
  result = result.replace(orphanRegex, '$1$2\u00A0');
  result = result.replace(orphanRegex, '$1$2\u00A0'); // Drugi przebieg dla słów występujących obok siebie (np. " a i ")
  
  // Zapobieganie łamaniu linii w słowach z myślnikiem typu e-mail
  result = result.replace(/e-mail/gi, 'e\u2011mail').replace(/e-commerce/gi, 'e\u2011commerce');
  
  return result;
}
