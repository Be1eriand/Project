CREATE TABLE EmployeeTable ( 
	payrollNumber        integer NOT NULL  PRIMARY KEY  ,
	FirstName            varchar(40) NOT NULL    ,
	LastName             varchar(40) NOT NULL    
 );

CREATE TABLE MachineTbl ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	MachineName          varchar(100) NOT NULL    ,
	MachineNumber        integer NOT NULL    
 );

CREATE TABLE RealTime_Data ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	Time                 time NOT NULL    ,
	Temperature          float     ,
	Current              float     ,
	Voltage              float     ,
	Length               float  DEFAULT 0.00   ,
	WireFeedRate         float     ,
	GasUsed              float     ,
	HeatInput            float     ,
	TravelSpeed          float     ,
	TimeDelta            float     ,
	Power                float     
 );

CREATE TABLE Specification ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	Side                 varchar(10)     ,
	Position             varchar(20)     ,
	Class                varchar(20)     ,
	Size                 float     ,
	Gas_Flux_Type        varchar(20)     ,
	Current_Max          float     ,
	Current_min          float     ,
	Voltage_Min          float     ,
	Voltage_Max          float     ,
	Polarity             float     ,
	Travel_Speed_Min     float     ,
	Travel_Speed_Max     float     ,
	Interpass_Temp_Min   float     ,
	Interpass_Temp_Max   float     ,
	Heat_Input_Min       float     ,
	Heat_Input_Max       float     
 );

CREATE TABLE WPS ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	WPS_No               varchar(20) NOT NULL    ,
	Welding_Code         varchar(20)     ,
	Joint_type           varchar(20)     
 );

CREATE TABLE WPS_Run ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	Run_No               integer     ,
	WPS_id               integer NOT NULL    ,
	Specification_id     integer NOT NULL    ,
	FOREIGN KEY ( WPS_id ) REFERENCES WPS( id )  ,
	FOREIGN KEY ( Specification_id ) REFERENCES Specification( id )  
 );

CREATE TABLE WeldTable ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	WPSNo                integer     ,
	RunNo                integer     
 );

CREATE TABLE WeldingTable ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	RT_id                integer NOT NULL    ,
	WT_id                integer NOT NULL    ,
	FOREIGN KEY ( RT_id ) REFERENCES RealTime_Data( id )  ,
	FOREIGN KEY ( WT_id ) REFERENCES WeldTable( id )  
 );

CREATE TABLE auth_group ( 
	id                   integer NOT NULL  PRIMARY KEY AUTOINCREMENT ,
	name                 varchar(150) NOT NULL    
 );

CREATE TABLE auth_user ( 
	id                   integer NOT NULL  PRIMARY KEY AUTOINCREMENT ,
	password             varchar(128) NOT NULL    ,
	last_login           datetime     ,
	is_superuser         boolean NOT NULL    ,
	username             varchar(150) NOT NULL    ,
	last_name            varchar(150) NOT NULL    ,
	email                varchar(254) NOT NULL    ,
	is_staff             boolean NOT NULL    ,
	is_active            boolean NOT NULL    ,
	date_joined          datetime NOT NULL    ,
	first_name           varchar(150) NOT NULL    
 );

CREATE TABLE auth_user_groups ( 
	id                   integer NOT NULL  PRIMARY KEY AUTOINCREMENT ,
	user_id              integer NOT NULL    ,
	group_id             integer NOT NULL    ,
	FOREIGN KEY ( user_id ) REFERENCES auth_user( id )  ,
	FOREIGN KEY ( group_id ) REFERENCES auth_group( id )  
 );

CREATE TABLE django_content_type ( 
	id                   integer NOT NULL  PRIMARY KEY AUTOINCREMENT ,
	app_label            varchar(100) NOT NULL    ,
	model                varchar(100) NOT NULL    
 );

CREATE TABLE django_migrations ( 
	id                   integer NOT NULL  PRIMARY KEY AUTOINCREMENT ,
	app                  varchar(255) NOT NULL    ,
	name                 varchar(255) NOT NULL    ,
	applied              datetime NOT NULL    
 );

CREATE TABLE django_session ( 
	session_key          varchar(40) NOT NULL  PRIMARY KEY  ,
	session_data         text NOT NULL    ,
	expire_date          datetime NOT NULL    
 );

CREATE TABLE Assignment ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	WT_id                integer NOT NULL    ,
	payrollNumber        integer NOT NULL    ,
	Machine_id           integer NOT NULL    ,
	FOREIGN KEY ( WT_id ) REFERENCES WeldTable( id )  ,
	FOREIGN KEY ( payrollNumber ) REFERENCES EmployeeTable( payrollNumber )  ,
	FOREIGN KEY ( Machine_id ) REFERENCES MachineTbl( id )  
 );

CREATE TABLE auth_permission ( 
	id                   integer NOT NULL  PRIMARY KEY AUTOINCREMENT ,
	content_type_id      integer NOT NULL    ,
	codename             varchar(100) NOT NULL    ,
	name                 varchar(255) NOT NULL    ,
	FOREIGN KEY ( content_type_id ) REFERENCES django_content_type( id )  
 );

CREATE TABLE auth_user_user_permissions ( 
	id                   integer NOT NULL  PRIMARY KEY AUTOINCREMENT ,
	user_id              integer NOT NULL    ,
	permission_id        integer NOT NULL    ,
	FOREIGN KEY ( user_id ) REFERENCES auth_user( id )  ,
	FOREIGN KEY ( permission_id ) REFERENCES auth_permission( id )  
 );

CREATE TABLE django_admin_log ( 
	id                   integer NOT NULL  PRIMARY KEY AUTOINCREMENT ,
	action_time          datetime NOT NULL    ,
	object_id            text     ,
	object_repr          varchar(200) NOT NULL    ,
	change_message       text NOT NULL    ,
	content_type_id      integer     ,
	user_id              integer NOT NULL    ,
	action_flag          smallint NOT NULL    ,
	"CHECK"              varchar     ,
	FOREIGN KEY ( content_type_id ) REFERENCES django_content_type( id )  ,
	FOREIGN KEY ( user_id ) REFERENCES auth_user( id )  ,
	CHECK (  "action_flag" >= 0 )
 );

CREATE TABLE auth_group_permissions ( 
	id                   integer NOT NULL  PRIMARY KEY AUTOINCREMENT ,
	group_id             integer NOT NULL    ,
	permission_id        integer NOT NULL    ,
	FOREIGN KEY ( group_id ) REFERENCES auth_group( id )  ,
	FOREIGN KEY ( permission_id ) REFERENCES auth_permission( id )  
 );

CREATE UNIQUE INDEX unq_auth_group_name ON auth_group ( name );

CREATE UNIQUE INDEX unq_auth_user_username ON auth_user ( username );

CREATE UNIQUE INDEX auth_user_groups_user_id_group_id_94350c0c_uniq ON auth_user_groups ( user_id, group_id );

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON auth_user_groups ( user_id );

CREATE INDEX auth_user_groups_group_id_97559544 ON auth_user_groups ( group_id );

CREATE UNIQUE INDEX django_content_type_app_label_model_76bd3d3b_uniq ON django_content_type ( app_label, model );

CREATE INDEX django_session_expire_date_a5c62663 ON django_session ( expire_date );

CREATE UNIQUE INDEX auth_permission_content_type_id_codename_01ab375a_uniq ON auth_permission ( content_type_id, codename );

CREATE INDEX auth_permission_content_type_id_2f476e4b ON auth_permission ( content_type_id );

CREATE UNIQUE INDEX auth_user_user_permissions_user_id_permission_id_14a6b632_uniq ON auth_user_user_permissions ( user_id, permission_id );

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON auth_user_user_permissions ( user_id );

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON auth_user_user_permissions ( permission_id );

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON django_admin_log ( content_type_id );

CREATE INDEX django_admin_log_user_id_c564eba6 ON django_admin_log ( user_id );

CREATE UNIQUE INDEX auth_group_permissions_group_id_permission_id_0cd325b0_uniq ON auth_group_permissions ( group_id, permission_id );

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON auth_group_permissions ( group_id );

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON auth_group_permissions ( permission_id );

