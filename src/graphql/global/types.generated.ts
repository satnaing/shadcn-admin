export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  DateTimeISO: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AiVariableExample = {
  __typename?: 'AiVariableExample';
  content: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type AnyModelUnion = CampaignContact | Message | SessionIdentity;

export enum ApprovalStatus {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type BatchModelDeleteInput = {
  ids: Array<Scalars['String']['input']>;
};

export type Campaign = {
  __typename?: 'Campaign';
  approvedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  approvedByIdentifier?: Maybe<Scalars['String']['output']>;
  connectedCount: Scalars['Float']['output'];
  connectionsSentCount: Scalars['Float']['output'];
  contactsCount: Scalars['Float']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  hoursBeforeMessage: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  isEnabled: Scalars['Boolean']['output'];
  lastSenderId?: Maybe<Scalars['String']['output']>;
  messageTemplate: Scalars['String']['output'];
  messagedCount: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  orgId: Scalars['String']['output'];
  pendingApprovalsCount: Scalars['Float']['output'];
  pendingCount: Scalars['Float']['output'];
  personaIds: Array<Scalars['String']['output']>;
  repliedCount: Scalars['Float']['output'];
  requireMessageApproval: Scalars['Boolean']['output'];
  senders: Array<ConnectedAccount>;
  skipConnectedProfiles: Scalars['Boolean']['output'];
  status: CampaignStatus;
  steps: Array<CampaignStep>;
  targetMarketId?: Maybe<Scalars['String']['output']>;
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type CampaignAnalytics = {
  __typename?: 'CampaignAnalytics';
  connectedCount: Scalars['Float']['output'];
  connectionsSentCount: Scalars['Float']['output'];
  contactsCount: Scalars['Float']['output'];
  messagedCount: Scalars['Float']['output'];
  pendingApprovalsCount: Scalars['Float']['output'];
  pendingCount: Scalars['Float']['output'];
  repliedCount: Scalars['Float']['output'];
};

export type CampaignContact = {
  __typename?: 'CampaignContact';
  campaign: Campaign;
  campaignId: Scalars['String']['output'];
  connectedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  connectionSentAt?: Maybe<Scalars['DateTimeISO']['output']>;
  contact: Contact;
  contactId: Scalars['String']['output'];
  contactedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  conversationId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  currentStepId?: Maybe<Scalars['String']['output']>;
  emailThreadId?: Maybe<Scalars['String']['output']>;
  emailThreadSubject?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  finishedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['String']['output'];
  liInvitationId?: Maybe<Scalars['String']['output']>;
  messages: Array<Message>;
  orgId: Scalars['String']['output'];
  reachoutReason?: Maybe<Scalars['String']['output']>;
  rejectedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  repliedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  sender?: Maybe<ConnectedAccount>;
  senderId?: Maybe<Scalars['String']['output']>;
  slackChannelId?: Maybe<Scalars['String']['output']>;
  slackThreadTs?: Maybe<Scalars['String']['output']>;
  status: CampaignContactStatus;
  statusReason?: Maybe<CampaignContactStatusReason>;
  stepApprovals: Array<CampaignStepApproval>;
  updatedAt: Scalars['DateTimeISO']['output'];
};


export type CampaignContactMessagesArgs = {
  page?: InputMaybe<PaginationInput>;
};

export type CampaignContactFilter = {
  campaignId?: InputMaybe<Scalars['String']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  senderId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type CampaignContactPauseInput = {
  allFromCompany?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
};

export enum CampaignContactStatus {
  AwaitingLimits = 'AWAITING_LIMITS',
  Error = 'ERROR',
  Finished = 'FINISHED',
  Pending = 'PENDING',
  Running = 'RUNNING',
  Stopped = 'STOPPED'
}

export enum CampaignContactStatusReason {
  ErrorCantInvite = 'ERROR_CANT_INVITE',
  ErrorInvalidLinkedinUrl = 'ERROR_INVALID_LINKEDIN_URL',
  ErrorMissingData = 'ERROR_MISSING_DATA',
  ErrorRecentlyInvited = 'ERROR_RECENTLY_INVITED',
  FinishedAlreadyConnected = 'FINISHED_ALREADY_CONNECTED',
  FinishedConnectionExpired = 'FINISHED_CONNECTION_EXPIRED',
  FinishedConnectionRejected = 'FINISHED_CONNECTION_REJECTED',
  FinishedTakenManually = 'FINISHED_TAKEN_MANUALLY',
  StoppedAlreadyContacted = 'STOPPED_ALREADY_CONTACTED',
  StoppedAwaitingApproval = 'STOPPED_AWAITING_APPROVAL',
  StoppedCampaignDeleted = 'STOPPED_CAMPAIGN_DELETED',
  StoppedColleagueReplied = 'STOPPED_COLLEAGUE_REPLIED',
  StoppedExcluded = 'STOPPED_EXCLUDED',
  StoppedManualStop = 'STOPPED_MANUAL_STOP',
  StoppedSenderRemoved = 'STOPPED_SENDER_REMOVED'
}

export type CampaignCreateInput = {
  connectionRequest?: InputMaybe<ConnectionRequestInput>;
  emailSequenceSteps: Array<MessageStepInput>;
  linkedinSequenceSteps: Array<MessageStepInput>;
  name: Scalars['String']['input'];
  personaIds: Array<Scalars['String']['input']>;
  senderIds: Array<Scalars['String']['input']>;
  targetMarketId: Scalars['String']['input'];
  timezone: Scalars['String']['input'];
};

export type CampaignDeleteInput = {
  campaignId: Scalars['String']['input'];
};

export type CampaignMessageAiVariableExamples = {
  __typename?: 'CampaignMessageAiVariableExamples';
  examples: Array<AiVariableExample>;
};

export type CampaignMessageExample = {
  __typename?: 'CampaignMessageExample';
  message: Scalars['String']['output'];
};

export type CampaignMessageExampleContactInput = {
  companyName?: InputMaybe<Scalars['String']['input']>;
  companyWebsite?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CampaignMessageExampleInput = {
  contact: CampaignMessageExampleContactInput;
  questions: Array<CampaignMessageExampleQuestionInput>;
  subjectTemplate?: InputMaybe<Scalars['String']['input']>;
  template: Scalars['String']['input'];
  type: MessageWriterAgentResponseType;
};

export type CampaignMessageExampleQuestionInput = {
  answer?: InputMaybe<Scalars['String']['input']>;
  details?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type CampaignMessageTemplateGenerateInput = {
  personaIds: Array<Scalars['String']['input']>;
  targetMarketId: Scalars['String']['input'];
  type: MessageWriterAgentResponseType;
};

export type CampaignMessageTemplateGenerateOutput = {
  __typename?: 'CampaignMessageTemplateGenerateOutput';
  subjectTemplate?: Maybe<Scalars['String']['output']>;
  template: Scalars['String']['output'];
};

export type CampaignPauseInput = {
  campaignId: Scalars['String']['input'];
};

export enum CampaignStatus {
  AwaitingApproval = 'AWAITING_APPROVAL',
  Enabled = 'ENABLED',
  Stopped = 'STOPPED'
}

export type CampaignStep = {
  __typename?: 'CampaignStep';
  campaignId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  /** [RecordStringAny] */
  data: Scalars['JSON']['output'];
  failureStepId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isEntry: Scalars['Boolean']['output'];
  orgId: Scalars['String']['output'];
  requireApproval: Scalars['Boolean']['output'];
  successStepId?: Maybe<Scalars['String']['output']>;
  type: CampaignStepType;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type CampaignStepApproval = {
  __typename?: 'CampaignStepApproval';
  campaignContact: CampaignContact;
  campaignContactId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  /** [RecordStringAny] */
  data?: Maybe<Scalars['JSON']['output']>;
  decidedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  decidedByEmail?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  orgId: Scalars['String']['output'];
  status: ApprovalStatus;
  stepId: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type CampaignStepApprovalUpdateInput = {
  action: Scalars['String']['input'];
  approvalId: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type CampaignStepApprovalsFilter = {
  campaignId: Scalars['String']['input'];
  stepId?: InputMaybe<Scalars['String']['input']>;
};

export enum CampaignStepType {
  EmailMessage = 'EMAIL_MESSAGE',
  LiConnectionRequest = 'LI_CONNECTION_REQUEST',
  LiMessage = 'LI_MESSAGE',
  LiProfileVisit = 'LI_PROFILE_VISIT',
  Wait = 'WAIT'
}

export type CampaignUpdateInput = {
  connectionRequest?: InputMaybe<ConnectionRequestInput>;
  emailSequenceSteps: Array<MessageStepInput>;
  id: Scalars['String']['input'];
  linkedinSequenceSteps: Array<MessageStepInput>;
  name: Scalars['String']['input'];
  personaIds: Array<Scalars['String']['input']>;
  senderIds: Array<Scalars['String']['input']>;
  targetMarketId: Scalars['String']['input'];
  timezone: Scalars['String']['input'];
};

export type CompaniesFilterInput = {
  listId?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type Company = {
  __typename?: 'Company';
  createdAt: Scalars['DateTimeISO']['output'];
  domain: Scalars['String']['output'];
  id: Scalars['String']['output'];
  linkedinUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nameCleaned?: Maybe<Scalars['String']['output']>;
  orgId: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export enum CompanyEvent {
  CompanyVisit = 'COMPANY_VISIT',
  ConnectionRequestAccepted = 'CONNECTION_REQUEST_ACCEPTED',
  ConnectionRequestSent = 'CONNECTION_REQUEST_SENT',
  MessageReceived = 'MESSAGE_RECEIVED',
  MessageSent = 'MESSAGE_SENT',
  PlayAdded = 'PLAY_ADDED'
}

export type CompanyEventLog = {
  __typename?: 'CompanyEventLog';
  actor?: Maybe<ModelName>;
  actorId?: Maybe<Scalars['String']['output']>;
  actorModel?: Maybe<AnyModelUnion>;
  createdAt: Scalars['DateTimeISO']['output'];
  /** [RecordStringAny] */
  data: Scalars['JSON']['output'];
  event: CompanyEvent;
  id: Scalars['String']['output'];
  object?: Maybe<ModelName>;
  objectId?: Maybe<Scalars['String']['output']>;
  objectModel?: Maybe<AnyModelUnion>;
  orgId: Scalars['String']['output'];
  relatedId?: Maybe<Scalars['String']['output']>;
  relatedModel?: Maybe<ModelName>;
};

export type CompanyEventLogFilter = {
  relatedId: Scalars['String']['input'];
  relatedModel: ModelName;
};

export type ConnectedAccount = {
  __typename?: 'ConnectedAccount';
  createdAt: Scalars['DateTimeISO']['output'];
  dailyConnectionLimit: Scalars['Int']['output'];
  dailyConnectionRequests: Scalars['Int']['output'];
  dailyEmailsLimit: Scalars['Int']['output'];
  dailyEmailsSent: Scalars['Int']['output'];
  dailyMessagesLimit: Scalars['Int']['output'];
  dailyMessagesSent: Scalars['Int']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailExternalId?: Maybe<Scalars['String']['output']>;
  emailProvider?: Maybe<EmailProvider>;
  emailSignature?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isEmailEnabled: Scalars['Boolean']['output'];
  isLinkedinEnabled: Scalars['Boolean']['output'];
  liInternalId?: Maybe<Scalars['String']['output']>;
  linkedinExternalId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  orgId: Scalars['String']['output'];
  profilePicUrl?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  userId: Scalars['String']['output'];
  weeklyConnectionLimit: Scalars['Int']['output'];
  weeklyConnectionRequests: Scalars['Int']['output'];
};

export type ConnectedAccountConnectionUrl = {
  __typename?: 'ConnectedAccountConnectionUrl';
  url: Scalars['String']['output'];
};

export type ConnectedAccountConnectionUrlInput = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  messagingAppType?: InputMaybe<MessagingAppType>;
};

export type ConnectedAccountDeleteInput = {
  id: Scalars['String']['input'];
  messagingAppType: MessagingAppType;
};

export type ConnectedAccountReconnectionUrlInput = {
  accountId: Scalars['String']['input'];
  messagingAppType: MessagingAppType;
};

export type ConnectionRequestInput = {
  skipConnectedProfiles: Scalars['Boolean']['input'];
  timeout: TimeInput;
};

export type Contact = {
  __typename?: 'Contact';
  companyId?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  companyWebsite?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  crmId?: Maybe<Scalars['String']['output']>;
  executionId?: Maybe<Scalars['String']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  identity: ContactIdentity;
  identityId?: Maybe<Scalars['String']['output']>;
  isVisitor: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  liInternalId?: Maybe<Scalars['String']['output']>;
  linkedinUrl?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  notifyOnMsgs: Scalars['Boolean']['output'];
  orgId: Scalars['String']['output'];
  ownerEmail?: Maybe<Scalars['String']['output']>;
  ownerSlackId?: Maybe<Scalars['String']['output']>;
  persona?: Maybe<ContactPersona>;
  personaFitReason?: Maybe<Scalars['String']['output']>;
  personaId?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  profilePicUrl?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  session: ContactSession;
  sessionId?: Maybe<Scalars['String']['output']>;
  source: ContactSource;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  workEmail?: Maybe<Scalars['String']['output']>;
};

export type ContactForTesting = {
  __typename?: 'ContactForTesting';
  companyId?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  companyWebsite?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  crmId?: Maybe<Scalars['String']['output']>;
  executionId?: Maybe<Scalars['String']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  identity: ContactIdentity;
  identityId?: Maybe<Scalars['String']['output']>;
  isVisitor: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  liInternalId?: Maybe<Scalars['String']['output']>;
  linkedinUrl?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  notifyOnMsgs: Scalars['Boolean']['output'];
  orgId: Scalars['String']['output'];
  ownerEmail?: Maybe<Scalars['String']['output']>;
  ownerSlackId?: Maybe<Scalars['String']['output']>;
  persona?: Maybe<ContactPersona>;
  personaFitReason?: Maybe<Scalars['String']['output']>;
  personaId?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  profilePicUrl?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  responses: Array<QuestionResponse>;
  session: ContactSession;
  sessionId?: Maybe<Scalars['String']['output']>;
  source: ContactSource;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  workEmail?: Maybe<Scalars['String']['output']>;
};

export type ContactIdentity = {
  __typename?: 'ContactIdentity';
  companyDomain?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
};

export type ContactPersona = {
  __typename?: 'ContactPersona';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ContactSession = {
  __typename?: 'ContactSession';
  id: Scalars['String']['output'];
  /** [RecordStringAny] */
  queryParams?: Maybe<Scalars['JSON']['output']>;
  referrer?: Maybe<Scalars['String']['output']>;
  /** [RecordStringAny] */
  utms?: Maybe<Scalars['JSON']['output']>;
};

export enum ContactSource {
  Agent = 'AGENT',
  Coresignal = 'CORESIGNAL',
  Explorium = 'EXPLORIUM',
  Generect = 'GENERECT',
  Linkup = 'LINKUP',
  Pdl = 'PDL',
  Visitor = 'VISITOR'
}

export type ContactsFilter = {
  identity?: InputMaybe<SessionIdentitiesFilter>;
};

export enum CrmApp {
  Hubspot = 'HUBSPOT',
  Salesforce = 'SALESFORCE'
}

export enum CrmCompanyCreate {
  All = 'ALL',
  None = 'NONE',
  TargetMarket = 'TARGET_MARKET'
}

export enum CrmContactCreate {
  All = 'ALL',
  None = 'NONE',
  Visitor = 'VISITOR'
}

export type CrmIntegration = {
  __typename?: 'CrmIntegration';
  accountSyncEnabled: Scalars['Boolean']['output'];
  apiKey?: Maybe<Scalars['String']['output']>;
  app: CrmApp;
  companiesToCreate: CrmCompanyCreate;
  contactsToCreate: CrmContactCreate;
  createdAt: Scalars['DateTimeISO']['output'];
  crmAccountId: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  excludeContactsWithoutEmail: Scalars['Boolean']['output'];
  /** [CrmListArray] */
  excludeLists: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  instanceUrl?: Maybe<Scalars['String']['output']>;
  lastAccountSyncAt?: Maybe<Scalars['DateTimeISO']['output']>;
  lastSyncAt: Scalars['DateTimeISO']['output'];
  /** [StringArray] */
  missingCompanyProperties: Scalars['JSON']['output'];
  /** [StringArray] */
  missingContactProperties: Scalars['JSON']['output'];
  notesToCreate: CrmNoteCreate;
  orgId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  userCrmId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type CrmIntegrationApiKeyGenerateInput = {
  app: CrmApp;
};

export type CrmIntegrationApiKeyGenerateOutput = {
  __typename?: 'CrmIntegrationApiKeyGenerateOutput';
  apiKey: Scalars['String']['output'];
};

export type CrmIntegrationUpdateInput = {
  companiesToCreate?: InputMaybe<CrmCompanyCreate>;
  contactsToCreate?: InputMaybe<CrmContactCreate>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  excludeContactsWithoutEmail?: InputMaybe<Scalars['Boolean']['input']>;
  excludeLists?: InputMaybe<Array<CrmListInput>>;
  notesToCreate?: InputMaybe<CrmNoteCreate>;
};

export type CrmList = {
  __typename?: 'CrmList';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  listId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type CrmListInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CrmListResponse = {
  __typename?: 'CrmListResponse';
  data: Array<CrmList>;
};

export enum CrmNoteCreate {
  Company = 'COMPANY',
  None = 'NONE'
}

export enum CustomerType {
  B2B = 'B2B',
  B2BB2C = 'B2B_B2C',
  B2C = 'B2C'
}

export type DailySessionTargetMarketFit = {
  __typename?: 'DailySessionTargetMarketFit';
  date: Scalars['String']['output'];
  targetMarketSessions: Scalars['Float']['output'];
  totalSessions: Scalars['Float']['output'];
};

export enum EmailProvider {
  Google = 'GOOGLE',
  Mail = 'MAIL',
  Outlook = 'OUTLOOK'
}

export type ExcludedCompany = {
  __typename?: 'ExcludedCompany';
  createdAt: Scalars['DateTimeISO']['output'];
  domain: Scalars['String']['output'];
  id: Scalars['String']['output'];
  orgId: Scalars['String']['output'];
};

export type ExcludedCompanyBulkCreateInput = {
  excludedCompanies: Array<ExcludedCompanyCreateInput>;
};

export type ExcludedCompanyBulkCreateOutput = {
  __typename?: 'ExcludedCompanyBulkCreateOutput';
  invalidCount: Scalars['Float']['output'];
  successCount: Scalars['Float']['output'];
};

export type ExcludedCompanyCreateInput = {
  domain: Scalars['String']['input'];
};

export type ExcludedCompanyDeleteInput = {
  ids: Array<Scalars['String']['input']>;
};

export type ExcludedCompanyFilter = {
  query?: InputMaybe<Scalars['String']['input']>;
};

export type GenericResolverResponse = {
  __typename?: 'GenericResolverResponse';
  code?: Maybe<Scalars['String']['output']>;
  count?: Maybe<Scalars['Float']['output']>;
  success: Scalars['Boolean']['output'];
};

export type IntegrationsOutput = {
  __typename?: 'IntegrationsOutput';
  apps: Array<Scalars['String']['output']>;
};

export type ListCompaniesUploadInput = {
  domains: Array<Scalars['String']['input']>;
  listId: Scalars['String']['input'];
};

export type ListCompanyRemoveInput = {
  companyId: Scalars['String']['input'];
  listId: Scalars['String']['input'];
};

export type ListDeleteInput = {
  id: Scalars['String']['input'];
};

export type ListUpsertInput = {
  crmLists?: InputMaybe<Array<CrmListInput>>;
  id?: InputMaybe<Scalars['String']['input']>;
  inboxChannel?: InputMaybe<SlackChannelInput>;
  name: Scalars['String']['input'];
  notificationChannel?: InputMaybe<SlackChannelInput>;
  type: Scalars['String']['input'];
};

export type Message = {
  __typename?: 'Message';
  appType: MessageAppType;
  campaignContactId: Scalars['String']['output'];
  campaignStepId?: Maybe<Scalars['String']['output']>;
  contactId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  externalId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  orgId: Scalars['String']['output'];
  reaction?: Maybe<Scalars['String']['output']>;
  source?: Maybe<MessageSource>;
  subject?: Maybe<Scalars['String']['output']>;
  text: Scalars['String']['output'];
  type: MessageType;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export enum MessageAppType {
  Email = 'EMAIL',
  Linkedin = 'LINKEDIN'
}

export enum MessageSource {
  External = 'EXTERNAL',
  Internal = 'INTERNAL'
}

export type MessageStepInput = {
  asReply?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  requireApproval: Scalars['Boolean']['input'];
  subjectTemplate?: InputMaybe<Scalars['String']['input']>;
  template: Scalars['String']['input'];
  type: CampaignStepType;
  wait?: InputMaybe<TimeInput>;
};

export enum MessageType {
  Reply = 'REPLY',
  Sent = 'SENT'
}

export enum MessageWriterAgentResponseType {
  Dm = 'DM',
  Email = 'EMAIL'
}

export enum MessagingAppType {
  Email = 'EMAIL',
  Linkedin = 'LINKEDIN'
}

export enum ModelName {
  CampaignContact = 'CAMPAIGN_CONTACT',
  Message = 'MESSAGE',
  SessionIdentity = 'SESSION_IDENTITY'
}

export type Mutation = {
  __typename?: 'Mutation';
  accountMappingSync: Scalars['Boolean']['output'];
  campaignContactPause: Array<CampaignContact>;
  campaignCreate: Campaign;
  campaignDelete: GenericResolverResponse;
  campaignMessageExampleGenerate: CampaignMessageExample;
  campaignMessageTemplateGenerate: CampaignMessageTemplateGenerateOutput;
  campaignPauseToggle: Campaign;
  campaignStepApprovalUpdate: CampaignStepApproval;
  campaignUpdate: Campaign;
  connectedAccountConnectionUrl: ConnectedAccountConnectionUrl;
  connectedAccountDelete: GenericResolverResponse;
  connectedAccountReconnectionUrl: ConnectedAccountConnectionUrl;
  crmIntegrationApiKeyGenerate: CrmIntegrationApiKeyGenerateOutput;
  crmIntegrationUpdate: CrmIntegration;
  excludedCompanyBulkCreate: ExcludedCompanyBulkCreateOutput;
  excludedCompanyDelete: GenericResolverResponse;
  listCompaniesUpload: GenericResolverResponse;
  listCompanyRemove: GenericResolverResponse;
  listDelete: GenericResolverResponse;
  listUpsert: TargetMarket;
  oauthLogin: GenericResolverResponse;
  personaUpsert: Persona;
  personasDelete: GenericResolverResponse;
  playbookScenarioCreate: PlaybookScenario;
  playbookScenarioUpdate: PlaybookScenario;
  playbookScenariosDelete: GenericResolverResponse;
  playbookUpdate: Playbook;
  promptCreate: Prompt;
  promptCreateVariants: Array<Prompt>;
  promptUpdate: Prompt;
  questionUpsert: Question;
  questionsDelete: GenericResolverResponse;
  sessionIdentityTargetMarketUpdate: SessionIdentity;
  slackIntegrationUpdate: GenericResolverResponse;
  subscriptionTrialStart: GenericResolverResponse;
  subscriptionUrlCreate: SubscriptionUrlCreateOutput;
  targetMarketDelete: GenericResolverResponse;
  targetMarketUpsert: TargetMarket;
  trackingScriptDomainUpdate: TrackingScript;
  trackingScriptUpdate: TrackingScript;
  userInvite: User;
  userLogin: User;
  userOrgUpdate: User;
  webhookIntegrationTest: WebhookIntegrationTestOutput;
  webhookIntegrationUpsert: WebhookIntegration;
};


export type MutationAccountMappingSyncArgs = {
  accountType: Scalars['String']['input'];
};


export type MutationCampaignContactPauseArgs = {
  input: CampaignContactPauseInput;
};


export type MutationCampaignCreateArgs = {
  input: CampaignCreateInput;
};


export type MutationCampaignDeleteArgs = {
  input: CampaignDeleteInput;
};


export type MutationCampaignMessageExampleGenerateArgs = {
  input: CampaignMessageExampleInput;
};


export type MutationCampaignMessageTemplateGenerateArgs = {
  input: CampaignMessageTemplateGenerateInput;
};


export type MutationCampaignPauseToggleArgs = {
  input: CampaignPauseInput;
};


export type MutationCampaignStepApprovalUpdateArgs = {
  input: CampaignStepApprovalUpdateInput;
};


export type MutationCampaignUpdateArgs = {
  input: CampaignUpdateInput;
};


export type MutationConnectedAccountConnectionUrlArgs = {
  input: ConnectedAccountConnectionUrlInput;
};


export type MutationConnectedAccountDeleteArgs = {
  input: ConnectedAccountDeleteInput;
};


export type MutationConnectedAccountReconnectionUrlArgs = {
  input: ConnectedAccountReconnectionUrlInput;
};


export type MutationCrmIntegrationApiKeyGenerateArgs = {
  input: CrmIntegrationApiKeyGenerateInput;
};


export type MutationCrmIntegrationUpdateArgs = {
  input: CrmIntegrationUpdateInput;
};


export type MutationExcludedCompanyBulkCreateArgs = {
  input: ExcludedCompanyBulkCreateInput;
};


export type MutationExcludedCompanyDeleteArgs = {
  input: ExcludedCompanyDeleteInput;
};


export type MutationListCompaniesUploadArgs = {
  input: ListCompaniesUploadInput;
};


export type MutationListCompanyRemoveArgs = {
  input: ListCompanyRemoveInput;
};


export type MutationListDeleteArgs = {
  input: ListDeleteInput;
};


export type MutationListUpsertArgs = {
  input: ListUpsertInput;
};


export type MutationOauthLoginArgs = {
  input: OauthLoginInput;
};


export type MutationPersonaUpsertArgs = {
  input: PersonaUpsertInput;
};


export type MutationPersonasDeleteArgs = {
  input: BatchModelDeleteInput;
};


export type MutationPlaybookScenarioCreateArgs = {
  input: PlaybookScenarioCreateInput;
};


export type MutationPlaybookScenarioUpdateArgs = {
  input: PlaybookScenarioUpdateInput;
};


export type MutationPlaybookScenariosDeleteArgs = {
  input: BatchModelDeleteInput;
};


export type MutationPlaybookUpdateArgs = {
  input: PlaybookUpdateInput;
};


export type MutationPromptCreateArgs = {
  input: PromptCreateNewInput;
};


export type MutationPromptCreateVariantsArgs = {
  input: PromptCreateVariantsInput;
};


export type MutationPromptUpdateArgs = {
  input: PromptInput;
};


export type MutationQuestionUpsertArgs = {
  input: QuestionUpsertInput;
};


export type MutationQuestionsDeleteArgs = {
  input: BatchModelDeleteInput;
};


export type MutationSessionIdentityTargetMarketUpdateArgs = {
  input: SessionIdentityTargetMarketUpdateInput;
};


export type MutationSlackIntegrationUpdateArgs = {
  input: SlackIntegrationUpdateInput;
};


export type MutationSubscriptionTrialStartArgs = {
  input: SubscriptionTrialStartInput;
};


export type MutationSubscriptionUrlCreateArgs = {
  input: SubscriptionUrlCreateInput;
};


export type MutationTargetMarketDeleteArgs = {
  input: TargetMarketDeleteInput;
};


export type MutationTargetMarketUpsertArgs = {
  input: TargetMarketUpsertInput;
};


export type MutationTrackingScriptDomainUpdateArgs = {
  input: TrackingScriptDomainUpdateInput;
};


export type MutationTrackingScriptUpdateArgs = {
  input: TrackingScriptUpdateInput;
};


export type MutationUserInviteArgs = {
  input: UserInviteInput;
};


export type MutationUserLoginArgs = {
  input?: InputMaybe<UserLoginInput>;
};


export type MutationUserOrgUpdateArgs = {
  orgId: Scalars['String']['input'];
};


export type MutationWebhookIntegrationTestArgs = {
  input: WebhookIntegrationTestInput;
};


export type MutationWebhookIntegrationUpsertArgs = {
  input: WebhookIntegrationUpsertInput;
};

export type OauthLoginInput = {
  app: Scalars['String']['input'];
  code: Scalars['String']['input'];
};

export enum OnboardingStatus {
  Completed = 'COMPLETED',
  NotStarted = 'NOT_STARTED',
  SlackConnected = 'SLACK_CONNECTED'
}

export type Org = {
  __typename?: 'Org';
  createdAt: Scalars['DateTimeISO']['output'];
  domain: Scalars['String']['output'];
  id: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export enum OrgRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Viewer = 'VIEWER'
}

export type PaginatedCampaignContacts = {
  __typename?: 'PaginatedCampaignContacts';
  data: Array<CampaignContact>;
  hasData?: Maybe<Scalars['Boolean']['output']>;
  hasMore: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Float']['output']>;
};

export type PaginatedCampaignStepApprovals = {
  __typename?: 'PaginatedCampaignStepApprovals';
  data: Array<CampaignStepApproval>;
  hasData?: Maybe<Scalars['Boolean']['output']>;
  hasMore: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Float']['output']>;
};

export type PaginatedCompanies = {
  __typename?: 'PaginatedCompanies';
  data: Array<Company>;
  hasData?: Maybe<Scalars['Boolean']['output']>;
  hasMore: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Float']['output']>;
};

export type PaginatedCompanyEventLogs = {
  __typename?: 'PaginatedCompanyEventLogs';
  data: Array<CompanyEventLog>;
  hasData?: Maybe<Scalars['Boolean']['output']>;
  hasMore: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Float']['output']>;
};

export type PaginatedContacts = {
  __typename?: 'PaginatedContacts';
  data: Array<Contact>;
  hasData?: Maybe<Scalars['Boolean']['output']>;
  hasMore: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Float']['output']>;
};

export type PaginatedExcludedCompanies = {
  __typename?: 'PaginatedExcludedCompanies';
  data: Array<ExcludedCompany>;
  hasData?: Maybe<Scalars['Boolean']['output']>;
  hasMore: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Float']['output']>;
};

export type PaginatedLists = {
  __typename?: 'PaginatedLists';
  data: Array<TargetMarket>;
  hasData?: Maybe<Scalars['Boolean']['output']>;
  hasMore: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Float']['output']>;
};

export type PaginatedSessionIdentities = {
  __typename?: 'PaginatedSessionIdentities';
  data: Array<SessionIdentity>;
  hasData?: Maybe<Scalars['Boolean']['output']>;
  hasMore: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Float']['output']>;
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  data: Array<User>;
  hasData?: Maybe<Scalars['Boolean']['output']>;
  hasMore: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Float']['output']>;
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset: Scalars['Float']['input'];
};

export type PagingInput = {
  skip: Scalars['Float']['input'];
  take: Scalars['Float']['input'];
};

export type Persona = {
  __typename?: 'Persona';
  campaignId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  maxContacts: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  orgId: Scalars['String']['output'];
  targetMarkets: Array<PersonaTargetMarket>;
  updatedAt: Scalars['DateTimeISO']['output'];
  valueProp?: Maybe<Scalars['String']['output']>;
};

export type PersonaFilters = {
  notUsedInCampaign?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PersonaTargetMarket = {
  __typename?: 'PersonaTargetMarket';
  createdAt: Scalars['DateTimeISO']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['String']['output'];
  personaId: Scalars['String']['output'];
  targetMarketId: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type PersonaUpsertInput = {
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  maxContacts: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  targetMarketIds: Array<Scalars['String']['input']>;
};

export type Playbook = {
  __typename?: 'Playbook';
  createdAt: Scalars['DateTimeISO']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  /** [SlackChannel] */
  notificationChannel?: Maybe<Scalars['JSON']['output']>;
  orgId: Scalars['String']['output'];
  outreachInstructions?: Maybe<Scalars['String']['output']>;
  scenarioCount: Scalars['Float']['output'];
  scenarios: Array<PlaybookScenario>;
  triggerId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type PlaybookScenario = {
  __typename?: 'PlaybookScenario';
  actionPlan: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  orgId: Scalars['String']['output'];
  playbookId: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type PlaybookScenarioCreateInput = {
  actionPlan: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  playbookId: Scalars['String']['input'];
};

export type PlaybookScenarioUpdateInput = {
  actionPlan?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PlaybookUpdateInput = {
  actionsPrompt?: InputMaybe<Scalars['String']['input']>;
  classificationPrompt?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  outreachPrompt?: InputMaybe<Scalars['String']['input']>;
};

export type Prompt = {
  __typename?: 'Prompt';
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isDisabled: Scalars['Boolean']['output'];
  lastUpdatedBy?: Maybe<Scalars['String']['output']>;
  /** [PromptMessages] */
  messages: Scalars['JSON']['output'];
  model: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  orgId: Scalars['String']['output'];
  responseFormat?: Maybe<PromptResponseFormat>;
  slug: Scalars['String']['output'];
  /** [StringArray] */
  stopSequences?: Maybe<Scalars['JSON']['output']>;
  temperature: Scalars['Float']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type PromptCreateNewInput = {
  orgDomain?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type PromptCreateVariantsInput = {
  orgDomain: Scalars['String']['input'];
  orgToCopyFromDomain?: InputMaybe<Scalars['String']['input']>;
  slugs: Array<Scalars['String']['input']>;
};

export type PromptInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  isDisabled?: InputMaybe<Scalars['Boolean']['input']>;
  messages?: InputMaybe<Array<PromptMessageInput>>;
  model?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  responseFormat?: InputMaybe<Scalars['String']['input']>;
  saveAsNewVersion?: InputMaybe<Scalars['Boolean']['input']>;
  stopSequences?: InputMaybe<Array<Scalars['String']['input']>>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
};

export type PromptMessageInput = {
  content: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export enum PromptResponseFormat {
  Json = 'JSON'
}

export type PromptRun = {
  __typename?: 'PromptRun';
  cost: Scalars['Float']['output'];
  durationSeconds: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  jobId?: Maybe<Scalars['String']['output']>;
  /** [PromptMessages] */
  messages: Scalars['JSON']['output'];
  promptId: Scalars['String']['output'];
  response: Scalars['String']['output'];
  sentAt: Scalars['DateTimeISO']['output'];
  tokens: Scalars['Float']['output'];
};

export type PromptVersion = {
  __typename?: 'PromptVersion';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  lastUpdatedBy?: Maybe<Scalars['String']['output']>;
  /** [PromptMessages] */
  messages: Scalars['JSON']['output'];
  model: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  promptId: Scalars['String']['output'];
  responseFormat?: Maybe<PromptResponseFormat>;
  /** [StringArray] */
  stopSequences?: Maybe<Scalars['JSON']['output']>;
  temperature: Scalars['Float']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type Query = {
  __typename?: 'Query';
  campaign: Campaign;
  campaignContacts: PaginatedCampaignContacts;
  campaignMessageAiVariableExamples: CampaignMessageAiVariableExamples;
  campaignStepApprovals: PaginatedCampaignStepApprovals;
  campaigns: Array<Campaign>;
  campaignsAnalytics: CampaignAnalytics;
  companies: PaginatedCompanies;
  companyEventLogs: PaginatedCompanyEventLogs;
  connectedAccounts: Array<ConnectedAccount>;
  contacts: PaginatedContacts;
  contactsForTesting: Array<ContactForTesting>;
  crmIntegration?: Maybe<CrmIntegration>;
  crmLists: CrmListResponse;
  excludedCompanies: PaginatedExcludedCompanies;
  integrations?: Maybe<IntegrationsOutput>;
  list?: Maybe<TargetMarket>;
  lists: PaginatedLists;
  org: Array<Org>;
  personas: Array<Persona>;
  playbook: Playbook;
  playbookScenarios: Array<PlaybookScenario>;
  playbooks: Array<Playbook>;
  promptRuns: Array<PromptRun>;
  promptVariants: Array<Prompt>;
  promptVersions: Array<PromptVersion>;
  prompts: Array<Prompt>;
  questionResponses: Array<QuestionResponse>;
  questions: Array<Question>;
  recentPageVisitUrls: RecentPageVisitUrlsOutput;
  session: Session;
  sessionAnalytics: SessionAnalyticsOutput;
  sessionIdentities: PaginatedSessionIdentities;
  sessionIdentity: SessionIdentity;
  slackChannels?: Maybe<Array<SlackChannel>>;
  slackIntegration?: Maybe<SlackIntegration>;
  slackUsers?: Maybe<Array<SlackUser>>;
  subscription?: Maybe<Subscription>;
  subscriptionUpdateUrl: SubscriptionUpdateUrlOutput;
  targetMarket?: Maybe<TargetMarket>;
  targetMarkets: Array<TargetMarket>;
  trackingScript: TrackingScript;
  user: User;
  userOrgs: Array<UserOrg>;
  users: PaginatedUsers;
  webhookIntegration?: Maybe<WebhookIntegration>;
};


export type QueryCampaignArgs = {
  id: Scalars['String']['input'];
};


export type QueryCampaignContactsArgs = {
  filters?: InputMaybe<CampaignContactFilter>;
  page?: InputMaybe<PaginationInput>;
};


export type QueryCampaignStepApprovalsArgs = {
  filters: CampaignStepApprovalsFilter;
  page?: InputMaybe<PaginationInput>;
};


export type QueryCompaniesArgs = {
  filters?: InputMaybe<CompaniesFilterInput>;
  page?: InputMaybe<PaginationInput>;
};


export type QueryCompanyEventLogsArgs = {
  filter: CompanyEventLogFilter;
};


export type QueryContactsArgs = {
  filters?: InputMaybe<ContactsFilter>;
  page?: InputMaybe<PaginationInput>;
};


export type QueryContactsForTestingArgs = {
  personaIds?: InputMaybe<Array<Scalars['String']['input']>>;
  targetMarketId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCrmListsArgs = {
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExcludedCompaniesArgs = {
  filter?: InputMaybe<ExcludedCompanyFilter>;
  page?: InputMaybe<PaginationInput>;
};


export type QueryListArgs = {
  id: Scalars['String']['input'];
};


export type QueryListsArgs = {
  page?: InputMaybe<PaginationInput>;
};


export type QueryPersonasArgs = {
  filter?: InputMaybe<PersonaFilters>;
};


export type QueryPlaybookArgs = {
  id: Scalars['String']['input'];
};


export type QueryPlaybookScenariosArgs = {
  playbookId: Scalars['String']['input'];
};


export type QueryPromptRunsArgs = {
  jobId?: InputMaybe<Scalars['String']['input']>;
  paging?: InputMaybe<PagingInput>;
  promptId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPromptVariantsArgs = {
  slug: Scalars['String']['input'];
};


export type QueryPromptVersionsArgs = {
  promptId: Scalars['String']['input'];
};


export type QueryPromptsArgs = {
  orgId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQuestionResponsesArgs = {
  identityId: Scalars['String']['input'];
};


export type QueryQuestionsArgs = {
  filters?: InputMaybe<QuestionFilters>;
};


export type QuerySessionArgs = {
  id: Scalars['String']['input'];
};


export type QuerySessionIdentitiesArgs = {
  filters?: InputMaybe<SessionIdentitiesFilter>;
  page?: InputMaybe<PaginationInput>;
};


export type QuerySessionIdentityArgs = {
  id: Scalars['String']['input'];
};


export type QuerySlackChannelsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySlackUsersArgs = {
  channelId: Scalars['String']['input'];
};


export type QueryTargetMarketArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  page?: InputMaybe<PaginationInput>;
};

export type Question = {
  __typename?: 'Question';
  answerCrmField?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  detailsCrmField?: Maybe<Scalars['String']['output']>;
  guidance?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isQualifying: Scalars['Boolean']['output'];
  orgId: Scalars['String']['output'];
  question: Scalars['String']['output'];
  /** [StringArray] */
  responseOptions?: Maybe<Scalars['JSON']['output']>;
  responseType: QuestionResponseType;
  slug?: Maybe<Scalars['String']['output']>;
  targetMarkets: Array<QuestionTargetMarket>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type QuestionFilters = {
  targetMarketIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type QuestionResponse = {
  __typename?: 'QuestionResponse';
  answer?: Maybe<Scalars['String']['output']>;
  confidence: Scalars['Int']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  details?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  identityId: Scalars['String']['output'];
  orgId: Scalars['String']['output'];
  question?: Maybe<Question>;
  questionId: Scalars['String']['output'];
  sessionId: Scalars['String']['output'];
  /** [StringArray] */
  sources: Scalars['JSON']['output'];
};

export enum QuestionResponseType {
  Bool = 'BOOL',
  Enum = 'ENUM',
  Number = 'NUMBER',
  Text = 'TEXT'
}

export type QuestionTargetMarket = {
  __typename?: 'QuestionTargetMarket';
  createdAt: Scalars['DateTimeISO']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['String']['output'];
  questionId: Scalars['String']['output'];
  targetMarketId: Scalars['String']['output'];
};

export type QuestionUpsertInput = {
  guidance?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isQualifying?: InputMaybe<Scalars['Boolean']['input']>;
  question: Scalars['String']['input'];
  responseOptions?: InputMaybe<Array<Scalars['String']['input']>>;
  responseType: Scalars['String']['input'];
  targetMarketIds: Array<Scalars['String']['input']>;
};

export type RecentPageVisitUrlsOutput = {
  __typename?: 'RecentPageVisitUrlsOutput';
  urls: Array<Scalars['String']['output']>;
};

export type Session = {
  __typename?: 'Session';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  endedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  events: Array<TrackEvent>;
  /** [StringArray] */
  hems?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['String']['output'];
  identity: SessionIdentity;
  ip: Scalars['String']['output'];
  lastActiveAt: Scalars['DateTimeISO']['output'];
  orgId: Scalars['String']['output'];
  origin: Scalars['String']['output'];
  /** [RecordStringAny] */
  queryParams?: Maybe<Scalars['JSON']['output']>;
  referrer?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  startedAt: Scalars['DateTimeISO']['output'];
  status: SessionStatus;
  userAgent?: Maybe<Scalars['String']['output']>;
  /** [RecordStringAny] */
  utms?: Maybe<Scalars['JSON']['output']>;
};

export type SessionAnalyticsOutput = {
  __typename?: 'SessionAnalyticsOutput';
  sessionsDaily: Array<DailySessionTargetMarketFit>;
};

export type SessionIdentitiesFilter = {
  endDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  isTargetMarket?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  targetMarketId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<SessionIdentityType>;
  urls?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type SessionIdentity = {
  __typename?: 'SessionIdentity';
  companyCrmId?: Maybe<Scalars['String']['output']>;
  companyDomain?: Maybe<Scalars['String']['output']>;
  companyId?: Maybe<Scalars['String']['output']>;
  companyLinkedinUrl?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  companyNameCleaned?: Maybe<Scalars['String']['output']>;
  contacts: Array<Contact>;
  contactsCount: Scalars['Float']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  employeeCount?: Maybe<Scalars['Int']['output']>;
  estRevenue?: Maybe<Scalars['BigInt']['output']>;
  hqCity?: Maybe<Scalars['String']['output']>;
  hqCountry?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isInIcp?: Maybe<Scalars['Boolean']['output']>;
  isInTargetMarket?: Maybe<Scalars['Boolean']['output']>;
  orgId: Scalars['String']['output'];
  parentIdentityId?: Maybe<Scalars['String']['output']>;
  personEmail?: Maybe<Scalars['String']['output']>;
  personFirstName?: Maybe<Scalars['String']['output']>;
  personLastName?: Maybe<Scalars['String']['output']>;
  personLinkedinUrl?: Maybe<Scalars['String']['output']>;
  personProfilePicUrl?: Maybe<Scalars['String']['output']>;
  personRole?: Maybe<Scalars['String']['output']>;
  session: Session;
  sessionId: Scalars['String']['output'];
  sessionLocation?: Maybe<Scalars['String']['output']>;
  sessionSummary?: Maybe<Scalars['String']['output']>;
  skipReason?: Maybe<SessionIdentitySkipReason>;
  slackThreadTs?: Maybe<Scalars['String']['output']>;
  source: SessionIdentitySource;
  targetMarketId?: Maybe<Scalars['String']['output']>;
  targetMarketReason?: Maybe<Scalars['String']['output']>;
  type: SessionIdentityType;
};

export enum SessionIdentitySkipReason {
  DailyLimitReached = 'DAILY_LIMIT_REACHED',
  Duplicate = 'DUPLICATE',
  ExcludedCompany = 'EXCLUDED_COMPANY',
  ExcludedCrm = 'EXCLUDED_CRM',
  ExcludedGlobal = 'EXCLUDED_GLOBAL',
  MissingDomain = 'MISSING_DOMAIN',
  OnlyContacts = 'ONLY_CONTACTS',
  TargetedLast_30D = 'TARGETED_LAST_30D'
}

export enum SessionIdentitySource {
  IdentityMatrix = 'IDENTITY_MATRIX',
  LeadFeeder = 'LEAD_FEEDER',
  Pdl = 'PDL',
  Rb2B = 'RB2B',
  Snitcher = 'SNITCHER',
  Vector = 'VECTOR'
}

export type SessionIdentityTargetMarketUpdateInput = {
  identityId: Scalars['String']['input'];
  targetMarketId: Scalars['String']['input'];
};

export enum SessionIdentityType {
  Company = 'COMPANY',
  Person = 'PERSON'
}

export enum SessionStatus {
  Active = 'ACTIVE',
  Closed = 'CLOSED'
}

export type SlackChannel = {
  __typename?: 'SlackChannel';
  id: Scalars['String']['output'];
  isPrivate?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
};

export type SlackChannelInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  taggingDisabled?: InputMaybe<Scalars['Boolean']['input']>;
  userIdsToTag?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type SlackIntegration = {
  __typename?: 'SlackIntegration';
  accountSyncEnabled: Scalars['Boolean']['output'];
  botToken: Scalars['String']['output'];
  botUserId?: Maybe<Scalars['String']['output']>;
  channelId: Scalars['String']['output'];
  channelName: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  enabled: Scalars['Boolean']['output'];
  hookUrl: Scalars['String']['output'];
  id: Scalars['String']['output'];
  /** [SlackChannel] */
  inboxChannel?: Maybe<Scalars['JSON']['output']>;
  lastAccountSyncAt?: Maybe<Scalars['DateTimeISO']['output']>;
  notificationsType: SlackNotificationsType;
  onboardingThreadTs?: Maybe<Scalars['String']['output']>;
  orgId: Scalars['String']['output'];
  requireBotTagging: Scalars['Boolean']['output'];
  sendDailyDigest: Scalars['Boolean']['output'];
  sendPlayReminders: Scalars['Boolean']['output'];
  slackAuthedUserId?: Maybe<Scalars['String']['output']>;
  slackTeamId?: Maybe<Scalars['String']['output']>;
  slackTeamName?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  userId: Scalars['String']['output'];
};

export type SlackIntegrationUpdateInput = {
  enabled: Scalars['Boolean']['input'];
  inboxChannel?: InputMaybe<SlackChannelInput>;
  notificationsType: SlackNotificationsType;
  sendDailyDigest?: InputMaybe<Scalars['Boolean']['input']>;
  sendPlayReminders?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum SlackNotificationsType {
  All = 'ALL',
  OnlyTargetMarket = 'ONLY_TARGET_MARKET'
}

export type SlackUser = {
  __typename?: 'SlackUser';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isBot?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  realName: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  credits: Scalars['Int']['output'];
  creditsUsed: Scalars['Int']['output'];
  dailyCreditsUsed?: Maybe<Scalars['Int']['output']>;
  dailyLimit?: Maybe<Scalars['Int']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  firstPayedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['String']['output'];
  interval: SubscriptionInterval;
  lastPayedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  orgId: Scalars['String']['output'];
  plan: SubscriptionPlan;
  renewsAt?: Maybe<Scalars['DateTimeISO']['output']>;
  startedAt: Scalars['DateTimeISO']['output'];
  status: SubscriptionStatus;
  trialEndsAt?: Maybe<Scalars['DateTimeISO']['output']>;
  trialStartedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export enum SubscriptionInterval {
  Monthly = 'MONTHLY',
  Quarterly = 'QUARTERLY',
  Yearly = 'YEARLY'
}

export enum SubscriptionPlan {
  Enterprise = 'ENTERPRISE',
  Free = 'FREE',
  Growth = 'GROWTH',
  Lite = 'LITE',
  Scale = 'SCALE',
  Starter = 'STARTER'
}

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  PendingCancellation = 'PENDING_CANCELLATION',
  Trial = 'TRIAL'
}

export type SubscriptionTrialStartInput = {
  variantId: Scalars['String']['input'];
};

export type SubscriptionUpdateUrlOutput = {
  __typename?: 'SubscriptionUpdateUrlOutput';
  changePlanUrl?: Maybe<Scalars['String']['output']>;
  portalUrl?: Maybe<Scalars['String']['output']>;
  updatePaymentMethodUrl?: Maybe<Scalars['String']['output']>;
};

export type SubscriptionUrlCreateInput = {
  variantId: Scalars['String']['input'];
};

export type SubscriptionUrlCreateOutput = {
  __typename?: 'SubscriptionUrlCreateOutput';
  url: Scalars['String']['output'];
};

export type TargetMarket = {
  __typename?: 'TargetMarket';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  /** [CrmListArray] */
  crmLists: Scalars['JSON']['output'];
  customerType?: Maybe<CustomerType>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  extraRequirements?: Maybe<Scalars['String']['output']>;
  /** [StringArray] */
  hqLocations: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  /** [SlackChannel] */
  inboxChannel?: Maybe<Scalars['JSON']['output']>;
  industry?: Maybe<Scalars['String']['output']>;
  maxEmployees?: Maybe<Scalars['Int']['output']>;
  maxRevenue?: Maybe<Scalars['BigInt']['output']>;
  minEmployees?: Maybe<Scalars['Int']['output']>;
  minRevenue?: Maybe<Scalars['BigInt']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  /** [SlackChannel] */
  notificationChannel?: Maybe<Scalars['JSON']['output']>;
  orgId: Scalars['String']['output'];
  personas?: Maybe<Array<Persona>>;
  questions?: Maybe<Array<Question>>;
  size: Scalars['Int']['output'];
  type: TargetMarketType;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type TargetMarketDeleteInput = {
  id: Scalars['String']['input'];
};

export enum TargetMarketType {
  ListCrm = 'LIST_CRM',
  ListManual = 'LIST_MANUAL',
  Segment = 'SEGMENT'
}

export type TargetMarketUpsertInput = {
  customerType?: InputMaybe<Scalars['String']['input']>;
  extraRequirements?: InputMaybe<Scalars['String']['input']>;
  hqLocations?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['String']['input']>;
  inboxChannel?: InputMaybe<SlackChannelInput>;
  industry?: InputMaybe<Scalars['String']['input']>;
  maxEmployees?: InputMaybe<Scalars['Int']['input']>;
  maxRevenue?: InputMaybe<Scalars['String']['input']>;
  minEmployees?: InputMaybe<Scalars['Int']['input']>;
  minRevenue?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationChannel?: InputMaybe<SlackChannelInput>;
};

export type TimeInput = {
  unit: Scalars['String']['input'];
  value: Scalars['Float']['input'];
};

export type TrackEvent = {
  __typename?: 'TrackEvent';
  createdAt: Scalars['DateTimeISO']['output'];
  /** [RecordStringAny] */
  data?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['String']['output'];
  sessionId: Scalars['String']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  type: TrackEventType;
  url?: Maybe<Scalars['String']['output']>;
};

export enum TrackEventType {
  Page = 'PAGE'
}

export type TrackingScript = {
  __typename?: 'TrackingScript';
  /** [StringArray] */
  allowedCountryCodes?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  dailyLimit: Scalars['Int']['output'];
  domain?: Maybe<Scalars['String']['output']>;
  /** [StringArray] */
  excludedPaths?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['String']['output'];
  identificationMode: TrackingScriptIdentificationMode;
  isEnabled: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  isWaterfall: Scalars['Boolean']['output'];
  minimumSessionTimeSec?: Maybe<Scalars['Int']['output']>;
  orgId: Scalars['String']['output'];
  pk: Scalars['String']['output'];
  /** [TrackingScriptProviders] */
  providers: Scalars['JSON']['output'];
  rb2b?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type TrackingScriptDomainUpdateInput = {
  domain: Scalars['String']['input'];
};

export type TrackingScriptExcludedPath = {
  path: Scalars['String']['input'];
};

export enum TrackingScriptIdentificationMode {
  All = 'ALL',
  OnlyContacts = 'ONLY_CONTACTS'
}

export type TrackingScriptUpdateInput = {
  allowedCountryCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  dailyLimit?: InputMaybe<Scalars['Int']['input']>;
  excludedPaths?: InputMaybe<Array<TrackingScriptExcludedPath>>;
  identificationMode: TrackingScriptIdentificationMode;
  minimumSessionTimeSec?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  onboardingStatus: OnboardingStatus;
  orgId: Scalars['String']['output'];
  status: UserStatus;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type UserInviteInput = {
  email: Scalars['String']['input'];
};

export type UserLoginInput = {
  utmCampaign?: InputMaybe<Scalars['String']['input']>;
  utmContent?: InputMaybe<Scalars['String']['input']>;
  utmMedium?: InputMaybe<Scalars['String']['input']>;
  utmSource?: InputMaybe<Scalars['String']['input']>;
  utmTerm?: InputMaybe<Scalars['String']['input']>;
};

export type UserOrg = {
  __typename?: 'UserOrg';
  isPrimary: Scalars['Boolean']['output'];
  isSelected: Scalars['Boolean']['output'];
  orgDomain: Scalars['String']['output'];
  orgId: Scalars['String']['output'];
  role: OrgRole;
};

export enum UserStatus {
  Active = 'ACTIVE',
  Invited = 'INVITED'
}

export type WebhookIntegration = {
  __typename?: 'WebhookIntegration';
  createdAt: Scalars['DateTimeISO']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  orgId: Scalars['String']['output'];
  secret: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  url: Scalars['String']['output'];
};

export type WebhookIntegrationTestInput = {
  url: Scalars['String']['input'];
};

export type WebhookIntegrationTestOutput = {
  __typename?: 'WebhookIntegrationTestOutput';
  error?: Maybe<Scalars['String']['output']>;
  request?: Maybe<WebhookIntegrationTestRequest>;
  response?: Maybe<WebhookIntegrationTestResponse>;
};

export type WebhookIntegrationTestRequest = {
  __typename?: 'WebhookIntegrationTestRequest';
  body: Scalars['String']['output'];
  headers: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type WebhookIntegrationTestResponse = {
  __typename?: 'WebhookIntegrationTestResponse';
  body?: Maybe<Scalars['String']['output']>;
  headers?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
};

export type WebhookIntegrationUpsertInput = {
  enabled: Scalars['Boolean']['input'];
  url: Scalars['String']['input'];
};
