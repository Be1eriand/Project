
namespace SensorServer
{
    partial class ServerForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ServerForm));
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.addMachineToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.MachineGroup = new System.Windows.Forms.GroupBox();
            this.button3 = new System.Windows.Forms.Button();
            this.button2 = new System.Windows.Forms.Button();
            this.textBox16 = new System.Windows.Forms.TextBox();
            this.sensorDataTableBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.sensorDataDBDataSet = new SensorDataDBDataSet();
            this.label13 = new System.Windows.Forms.Label();
            this.textBox10 = new System.Windows.Forms.TextBox();
            this.textBox11 = new System.Windows.Forms.TextBox();
            this.textBox12 = new System.Windows.Forms.TextBox();
            this.textBox13 = new System.Windows.Forms.TextBox();
            this.textBox14 = new System.Windows.Forms.TextBox();
            this.textBox15 = new System.Windows.Forms.TextBox();
            this.textBox9 = new System.Windows.Forms.TextBox();
            this.textBox8 = new System.Windows.Forms.TextBox();
            this.textBox7 = new System.Windows.Forms.TextBox();
            this.textBox6 = new System.Windows.Forms.TextBox();
            this.textBox5 = new System.Windows.Forms.TextBox();
            this.textBox4 = new System.Windows.Forms.TextBox();
            this.textBox3 = new System.Windows.Forms.TextBox();
            this.textBox2 = new System.Windows.Forms.TextBox();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.button1 = new System.Windows.Forms.Button();
            this.label12 = new System.Windows.Forms.Label();
            this.label11 = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.bindingNavigator1 = new System.Windows.Forms.BindingNavigator(this.components);
            this.bindingNavigatorAddNewItem = new System.Windows.Forms.ToolStripButton();
            this.bindingNavigatorCountItem = new System.Windows.Forms.ToolStripLabel();
            this.bindingNavigatorDeleteItem = new System.Windows.Forms.ToolStripButton();
            this.bindingNavigatorMoveFirstItem = new System.Windows.Forms.ToolStripButton();
            this.bindingNavigatorMovePreviousItem = new System.Windows.Forms.ToolStripButton();
            this.bindingNavigatorSeparator = new System.Windows.Forms.ToolStripSeparator();
            this.bindingNavigatorPositionItem = new System.Windows.Forms.ToolStripTextBox();
            this.bindingNavigatorSeparator1 = new System.Windows.Forms.ToolStripSeparator();
            this.bindingNavigatorMoveNextItem = new System.Windows.Forms.ToolStripButton();
            this.bindingNavigatorMoveLastItem = new System.Windows.Forms.ToolStripButton();
            this.bindingNavigatorSeparator2 = new System.Windows.Forms.ToolStripSeparator();
            this.sensorDataTableTableAdapter = new SensorDataDBDataSetTableAdapters.SensorDataTableTableAdapter();
            this.menuStrip1.SuspendLayout();
            this.MachineGroup.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.sensorDataTableBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.sensorDataDBDataSet)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.bindingNavigator1)).BeginInit();
            this.bindingNavigator1.SuspendLayout();
            this.SuspendLayout();
            // 
            // menuStrip1
            // 
            this.menuStrip1.ImageScalingSize = new System.Drawing.Size(20, 20);
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.addMachineToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(1096, 28);
            this.menuStrip1.TabIndex = 0;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // addMachineToolStripMenuItem
            // 
            this.addMachineToolStripMenuItem.Name = "addMachineToolStripMenuItem";
            this.addMachineToolStripMenuItem.Size = new System.Drawing.Size(111, 24);
            this.addMachineToolStripMenuItem.Text = "Add Machine";
            // 
            // MachineGroup
            // 
            this.MachineGroup.Controls.Add(this.button3);
            this.MachineGroup.Controls.Add(this.button2);
            this.MachineGroup.Controls.Add(this.textBox16);
            this.MachineGroup.Controls.Add(this.label13);
            this.MachineGroup.Controls.Add(this.textBox10);
            this.MachineGroup.Controls.Add(this.textBox11);
            this.MachineGroup.Controls.Add(this.textBox12);
            this.MachineGroup.Controls.Add(this.textBox13);
            this.MachineGroup.Controls.Add(this.textBox14);
            this.MachineGroup.Controls.Add(this.textBox15);
            this.MachineGroup.Controls.Add(this.textBox9);
            this.MachineGroup.Controls.Add(this.textBox8);
            this.MachineGroup.Controls.Add(this.textBox7);
            this.MachineGroup.Controls.Add(this.textBox6);
            this.MachineGroup.Controls.Add(this.textBox5);
            this.MachineGroup.Controls.Add(this.textBox4);
            this.MachineGroup.Controls.Add(this.textBox3);
            this.MachineGroup.Controls.Add(this.textBox2);
            this.MachineGroup.Controls.Add(this.textBox1);
            this.MachineGroup.Controls.Add(this.button1);
            this.MachineGroup.Controls.Add(this.label12);
            this.MachineGroup.Controls.Add(this.label11);
            this.MachineGroup.Controls.Add(this.label10);
            this.MachineGroup.Controls.Add(this.label9);
            this.MachineGroup.Controls.Add(this.label8);
            this.MachineGroup.Controls.Add(this.label7);
            this.MachineGroup.Controls.Add(this.label6);
            this.MachineGroup.Controls.Add(this.label5);
            this.MachineGroup.Controls.Add(this.label4);
            this.MachineGroup.Controls.Add(this.label3);
            this.MachineGroup.Controls.Add(this.label2);
            this.MachineGroup.Controls.Add(this.label1);
            this.MachineGroup.Location = new System.Drawing.Point(12, 58);
            this.MachineGroup.Name = "MachineGroup";
            this.MachineGroup.Size = new System.Drawing.Size(306, 466);
            this.MachineGroup.TabIndex = 1;
            this.MachineGroup.TabStop = false;
            this.MachineGroup.Text = "Settings";
            // 
            // button3
            // 
            this.button3.Location = new System.Drawing.Point(164, 353);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(142, 41);
            this.button3.TabIndex = 57;
            this.button3.Text = "Stop Machine";
            this.button3.UseVisualStyleBackColor = true;
            this.button3.Click += new System.EventHandler(this.button3_Click);
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(0, 353);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(142, 41);
            this.button2.TabIndex = 56;
            this.button2.Text = "Start Machine";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // textBox16
            // 
            this.textBox16.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "Runid", true));
            this.textBox16.Location = new System.Drawing.Point(152, 123);
            this.textBox16.Name = "textBox16";
            this.textBox16.Size = new System.Drawing.Size(136, 22);
            this.textBox16.TabIndex = 55;
            // 
            // sensorDataTableBindingSource
            // 
            this.sensorDataTableBindingSource.DataMember = "SensorDataTable";
            this.sensorDataTableBindingSource.DataSource = this.sensorDataDBDataSet;
            // 
            // sensorDataDBDataSet
            // 
            this.sensorDataDBDataSet.DataSetName = "SensorDataDBDataSet";
            this.sensorDataDBDataSet.SchemaSerializationMode = System.Data.SchemaSerializationMode.IncludeSchema;
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(74, 123);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(60, 17);
            this.label13.TabIndex = 54;
            this.label13.Text = "Run No.";
            // 
            // textBox10
            // 
            this.textBox10.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "GasUsed_var", true));
            this.textBox10.Location = new System.Drawing.Point(224, 311);
            this.textBox10.Name = "textBox10";
            this.textBox10.Size = new System.Drawing.Size(66, 22);
            this.textBox10.TabIndex = 53;
            // 
            // textBox11
            // 
            this.textBox11.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "WFR_var", true));
            this.textBox11.Location = new System.Drawing.Point(224, 285);
            this.textBox11.Name = "textBox11";
            this.textBox11.Size = new System.Drawing.Size(66, 22);
            this.textBox11.TabIndex = 52;
            // 
            // textBox12
            // 
            this.textBox12.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "WeldLength_var", true));
            this.textBox12.Location = new System.Drawing.Point(224, 257);
            this.textBox12.Name = "textBox12";
            this.textBox12.Size = new System.Drawing.Size(66, 22);
            this.textBox12.TabIndex = 51;
            // 
            // textBox13
            // 
            this.textBox13.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "Tempertaure_var", true));
            this.textBox13.Location = new System.Drawing.Point(224, 229);
            this.textBox13.Name = "textBox13";
            this.textBox13.Size = new System.Drawing.Size(66, 22);
            this.textBox13.TabIndex = 50;
            // 
            // textBox14
            // 
            this.textBox14.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "Voltage_var", true));
            this.textBox14.Location = new System.Drawing.Point(224, 201);
            this.textBox14.Name = "textBox14";
            this.textBox14.Size = new System.Drawing.Size(66, 22);
            this.textBox14.TabIndex = 49;
            // 
            // textBox15
            // 
            this.textBox15.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "Current_var", true));
            this.textBox15.Location = new System.Drawing.Point(224, 173);
            this.textBox15.Name = "textBox15";
            this.textBox15.Size = new System.Drawing.Size(66, 22);
            this.textBox15.TabIndex = 48;
            // 
            // textBox9
            // 
            this.textBox9.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "GasUsed", true));
            this.textBox9.Location = new System.Drawing.Point(152, 311);
            this.textBox9.Name = "textBox9";
            this.textBox9.Size = new System.Drawing.Size(66, 22);
            this.textBox9.TabIndex = 47;
            // 
            // textBox8
            // 
            this.textBox8.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "WFR", true));
            this.textBox8.Location = new System.Drawing.Point(152, 285);
            this.textBox8.Name = "textBox8";
            this.textBox8.Size = new System.Drawing.Size(66, 22);
            this.textBox8.TabIndex = 46;
            // 
            // textBox7
            // 
            this.textBox7.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "WeldLength", true));
            this.textBox7.Location = new System.Drawing.Point(152, 257);
            this.textBox7.Name = "textBox7";
            this.textBox7.Size = new System.Drawing.Size(66, 22);
            this.textBox7.TabIndex = 45;
            // 
            // textBox6
            // 
            this.textBox6.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "Temperature", true));
            this.textBox6.Location = new System.Drawing.Point(152, 229);
            this.textBox6.Name = "textBox6";
            this.textBox6.Size = new System.Drawing.Size(66, 22);
            this.textBox6.TabIndex = 44;
            // 
            // textBox5
            // 
            this.textBox5.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "Voltage", true));
            this.textBox5.Location = new System.Drawing.Point(152, 201);
            this.textBox5.Name = "textBox5";
            this.textBox5.Size = new System.Drawing.Size(66, 22);
            this.textBox5.TabIndex = 43;
            // 
            // textBox4
            // 
            this.textBox4.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "Current", true));
            this.textBox4.Location = new System.Drawing.Point(152, 173);
            this.textBox4.Name = "textBox4";
            this.textBox4.Size = new System.Drawing.Size(66, 22);
            this.textBox4.TabIndex = 42;
            // 
            // textBox3
            // 
            this.textBox3.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "Jobid", true));
            this.textBox3.Location = new System.Drawing.Point(152, 91);
            this.textBox3.Name = "textBox3";
            this.textBox3.Size = new System.Drawing.Size(136, 22);
            this.textBox3.TabIndex = 41;
            // 
            // textBox2
            // 
            this.textBox2.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "Welderid", true));
            this.textBox2.Location = new System.Drawing.Point(152, 58);
            this.textBox2.Name = "textBox2";
            this.textBox2.Size = new System.Drawing.Size(136, 22);
            this.textBox2.TabIndex = 40;
            // 
            // textBox1
            // 
            this.textBox1.DataBindings.Add(new System.Windows.Forms.Binding("Text", this.sensorDataTableBindingSource, "Machineid", true));
            this.textBox1.Location = new System.Drawing.Point(152, 25);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(136, 22);
            this.textBox1.TabIndex = 39;
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(72, 419);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(142, 41);
            this.button1.TabIndex = 38;
            this.button1.Text = "Update";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(47, 30);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(78, 17);
            this.label12.TabIndex = 36;
            this.label12.Text = "Machine ID";
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(224, 148);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(64, 17);
            this.label11.TabIndex = 10;
            this.label11.Text = "Variance";
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(157, 148);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(61, 17);
            this.label10.TabIndex = 9;
            this.label10.Text = "Average";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(54, 314);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(71, 17);
            this.label9.TabIndex = 8;
            this.label9.Text = "Gas Used";
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(19, 288);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(107, 17);
            this.label8.TabIndex = 7;
            this.label8.Text = "Wire Feed Rate";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(38, 260);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(88, 17);
            this.label7.TabIndex = 6;
            this.label7.Text = "Weld Length";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(36, 232);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(90, 17);
            this.label6.TabIndex = 5;
            this.label6.Text = "Temperature";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(69, 204);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(56, 17);
            this.label5.TabIndex = 4;
            this.label5.Text = "Voltage";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(70, 176);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(55, 17);
            this.label4.TabIndex = 3;
            this.label4.Text = "Current";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(14, 148);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(63, 17);
            this.label3.TabIndex = 2;
            this.label3.Text = "Settings:";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(74, 91);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(52, 17);
            this.label2.TabIndex = 1;
            this.label2.Text = "TaskID";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(10, 61);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(115, 17);
            this.label1.TabIndex = 0;
            this.label1.Text = "Assigned Welder";
            // 
            // bindingNavigator1
            // 
            this.bindingNavigator1.AddNewItem = this.bindingNavigatorAddNewItem;
            this.bindingNavigator1.BindingSource = this.sensorDataTableBindingSource;
            this.bindingNavigator1.CountItem = this.bindingNavigatorCountItem;
            this.bindingNavigator1.DeleteItem = this.bindingNavigatorDeleteItem;
            this.bindingNavigator1.ImageScalingSize = new System.Drawing.Size(20, 20);
            this.bindingNavigator1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.bindingNavigatorMoveFirstItem,
            this.bindingNavigatorMovePreviousItem,
            this.bindingNavigatorSeparator,
            this.bindingNavigatorPositionItem,
            this.bindingNavigatorCountItem,
            this.bindingNavigatorSeparator1,
            this.bindingNavigatorMoveNextItem,
            this.bindingNavigatorMoveLastItem,
            this.bindingNavigatorSeparator2,
            this.bindingNavigatorAddNewItem,
            this.bindingNavigatorDeleteItem});
            this.bindingNavigator1.Location = new System.Drawing.Point(0, 28);
            this.bindingNavigator1.MoveFirstItem = this.bindingNavigatorMoveFirstItem;
            this.bindingNavigator1.MoveLastItem = this.bindingNavigatorMoveLastItem;
            this.bindingNavigator1.MoveNextItem = this.bindingNavigatorMoveNextItem;
            this.bindingNavigator1.MovePreviousItem = this.bindingNavigatorMovePreviousItem;
            this.bindingNavigator1.Name = "bindingNavigator1";
            this.bindingNavigator1.PositionItem = this.bindingNavigatorPositionItem;
            this.bindingNavigator1.Size = new System.Drawing.Size(1096, 27);
            this.bindingNavigator1.TabIndex = 2;
            this.bindingNavigator1.Text = "bindingNavigator1";
            // 
            // bindingNavigatorAddNewItem
            // 
            this.bindingNavigatorAddNewItem.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.bindingNavigatorAddNewItem.Image = ((System.Drawing.Image)(resources.GetObject("bindingNavigatorAddNewItem.Image")));
            this.bindingNavigatorAddNewItem.Name = "bindingNavigatorAddNewItem";
            this.bindingNavigatorAddNewItem.RightToLeftAutoMirrorImage = true;
            this.bindingNavigatorAddNewItem.Size = new System.Drawing.Size(29, 24);
            this.bindingNavigatorAddNewItem.Text = "Add new";
            this.bindingNavigatorAddNewItem.Click += new System.EventHandler(this.bindingNavigatorAddNewItem_Click);
            // 
            // bindingNavigatorCountItem
            // 
            this.bindingNavigatorCountItem.Name = "bindingNavigatorCountItem";
            this.bindingNavigatorCountItem.Size = new System.Drawing.Size(45, 24);
            this.bindingNavigatorCountItem.Text = "of {0}";
            this.bindingNavigatorCountItem.ToolTipText = "Total number of items";
            // 
            // bindingNavigatorDeleteItem
            // 
            this.bindingNavigatorDeleteItem.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.bindingNavigatorDeleteItem.Image = ((System.Drawing.Image)(resources.GetObject("bindingNavigatorDeleteItem.Image")));
            this.bindingNavigatorDeleteItem.Name = "bindingNavigatorDeleteItem";
            this.bindingNavigatorDeleteItem.RightToLeftAutoMirrorImage = true;
            this.bindingNavigatorDeleteItem.Size = new System.Drawing.Size(29, 24);
            this.bindingNavigatorDeleteItem.Text = "Delete";
            // 
            // bindingNavigatorMoveFirstItem
            // 
            this.bindingNavigatorMoveFirstItem.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.bindingNavigatorMoveFirstItem.Image = ((System.Drawing.Image)(resources.GetObject("bindingNavigatorMoveFirstItem.Image")));
            this.bindingNavigatorMoveFirstItem.Name = "bindingNavigatorMoveFirstItem";
            this.bindingNavigatorMoveFirstItem.RightToLeftAutoMirrorImage = true;
            this.bindingNavigatorMoveFirstItem.Size = new System.Drawing.Size(29, 24);
            this.bindingNavigatorMoveFirstItem.Text = "Move first";
            // 
            // bindingNavigatorMovePreviousItem
            // 
            this.bindingNavigatorMovePreviousItem.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.bindingNavigatorMovePreviousItem.Image = ((System.Drawing.Image)(resources.GetObject("bindingNavigatorMovePreviousItem.Image")));
            this.bindingNavigatorMovePreviousItem.Name = "bindingNavigatorMovePreviousItem";
            this.bindingNavigatorMovePreviousItem.RightToLeftAutoMirrorImage = true;
            this.bindingNavigatorMovePreviousItem.Size = new System.Drawing.Size(29, 24);
            this.bindingNavigatorMovePreviousItem.Text = "Move previous";
            // 
            // bindingNavigatorSeparator
            // 
            this.bindingNavigatorSeparator.Name = "bindingNavigatorSeparator";
            this.bindingNavigatorSeparator.Size = new System.Drawing.Size(6, 27);
            // 
            // bindingNavigatorPositionItem
            // 
            this.bindingNavigatorPositionItem.AccessibleName = "Position";
            this.bindingNavigatorPositionItem.AutoSize = false;
            this.bindingNavigatorPositionItem.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.bindingNavigatorPositionItem.Name = "bindingNavigatorPositionItem";
            this.bindingNavigatorPositionItem.Size = new System.Drawing.Size(50, 27);
            this.bindingNavigatorPositionItem.Text = "0";
            this.bindingNavigatorPositionItem.ToolTipText = "Current position";
            // 
            // bindingNavigatorSeparator1
            // 
            this.bindingNavigatorSeparator1.Name = "bindingNavigatorSeparator1";
            this.bindingNavigatorSeparator1.Size = new System.Drawing.Size(6, 27);
            // 
            // bindingNavigatorMoveNextItem
            // 
            this.bindingNavigatorMoveNextItem.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.bindingNavigatorMoveNextItem.Image = ((System.Drawing.Image)(resources.GetObject("bindingNavigatorMoveNextItem.Image")));
            this.bindingNavigatorMoveNextItem.Name = "bindingNavigatorMoveNextItem";
            this.bindingNavigatorMoveNextItem.RightToLeftAutoMirrorImage = true;
            this.bindingNavigatorMoveNextItem.Size = new System.Drawing.Size(29, 24);
            this.bindingNavigatorMoveNextItem.Text = "Move next";
            // 
            // bindingNavigatorMoveLastItem
            // 
            this.bindingNavigatorMoveLastItem.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.bindingNavigatorMoveLastItem.Image = ((System.Drawing.Image)(resources.GetObject("bindingNavigatorMoveLastItem.Image")));
            this.bindingNavigatorMoveLastItem.Name = "bindingNavigatorMoveLastItem";
            this.bindingNavigatorMoveLastItem.RightToLeftAutoMirrorImage = true;
            this.bindingNavigatorMoveLastItem.Size = new System.Drawing.Size(29, 24);
            this.bindingNavigatorMoveLastItem.Text = "Move last";
            // 
            // bindingNavigatorSeparator2
            // 
            this.bindingNavigatorSeparator2.Name = "bindingNavigatorSeparator2";
            this.bindingNavigatorSeparator2.Size = new System.Drawing.Size(6, 27);
            // 
            // sensorDataTableTableAdapter
            // 
            this.sensorDataTableTableAdapter.ClearBeforeFill = true;
            // 
            // ServerForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1096, 566);
            this.Controls.Add(this.bindingNavigator1);
            this.Controls.Add(this.MachineGroup);
            this.Controls.Add(this.menuStrip1);
            this.Name = "ServerForm";
            this.Text = "Sensor Data Server";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.MachineGroup.ResumeLayout(false);
            this.MachineGroup.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.sensorDataTableBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.sensorDataDBDataSet)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.bindingNavigator1)).EndInit();
            this.bindingNavigator1.ResumeLayout(false);
            this.bindingNavigator1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem addMachineToolStripMenuItem;
        private System.Windows.Forms.GroupBox MachineGroup;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.BindingNavigator bindingNavigator1;
        private System.Windows.Forms.ToolStripButton bindingNavigatorAddNewItem;
        private System.Windows.Forms.ToolStripLabel bindingNavigatorCountItem;
        private System.Windows.Forms.ToolStripButton bindingNavigatorDeleteItem;
        private System.Windows.Forms.ToolStripButton bindingNavigatorMoveFirstItem;
        private System.Windows.Forms.ToolStripButton bindingNavigatorMovePreviousItem;
        private System.Windows.Forms.ToolStripSeparator bindingNavigatorSeparator;
        private System.Windows.Forms.ToolStripTextBox bindingNavigatorPositionItem;
        private System.Windows.Forms.ToolStripSeparator bindingNavigatorSeparator1;
        private System.Windows.Forms.ToolStripButton bindingNavigatorMoveNextItem;
        private System.Windows.Forms.ToolStripButton bindingNavigatorMoveLastItem;
        private System.Windows.Forms.ToolStripSeparator bindingNavigatorSeparator2;
        private System.Windows.Forms.TextBox textBox10;
        private System.Windows.Forms.TextBox textBox11;
        private System.Windows.Forms.TextBox textBox12;
        private System.Windows.Forms.TextBox textBox13;
        private System.Windows.Forms.TextBox textBox14;
        private System.Windows.Forms.TextBox textBox15;
        private System.Windows.Forms.TextBox textBox9;
        private System.Windows.Forms.TextBox textBox8;
        private System.Windows.Forms.TextBox textBox7;
        private System.Windows.Forms.TextBox textBox6;
        private System.Windows.Forms.TextBox textBox5;
        private System.Windows.Forms.TextBox textBox4;
        private System.Windows.Forms.TextBox textBox3;
        private System.Windows.Forms.TextBox textBox2;
        private System.Windows.Forms.TextBox textBox1;
        private SensorDataDBDataSet sensorDataDBDataSet;
        private System.Windows.Forms.BindingSource sensorDataTableBindingSource;
        private SensorDataDBDataSetTableAdapters.SensorDataTableTableAdapter sensorDataTableTableAdapter;
        private System.Windows.Forms.TextBox textBox16;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.Button button3;
        private System.Windows.Forms.Button button2;
    }
}

