export type codeStanza = {
  code: string;
};

export type pageStanza = {
  jsx: string;
};

export type stanza = codeStanza | pageStanza;

export type flow = {
  stanzas: stanza[];
};
