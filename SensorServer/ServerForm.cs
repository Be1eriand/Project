using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace SensorServer
{
    public partial class ServerForm : Form
    {
        Thread ctThread = null;
        SensorServer Server;

        public ServerForm()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // TODO: This line of code loads data into the 'sensorDataDBDataSet.SensorDataTable' table. You can move, or remove it, as needed.
            this.sensorDataTableTableAdapter.Fill(this.sensorDataDBDataSet.SensorDataTable);
            Server = new SensorServer("127.0.0.1", 8888);

            Server.Start();

            ctThread = new Thread(Server.Serve) 
            {
                IsBackground = true
            };

            ctThread.Start();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            TaskData task;

            ushort machineID = (ushort)Convert.ToInt32(textBox1.Text.ToString());

            uint welderID = (uint)Convert.ToInt32(textBox2.Text.ToString());
            uint jobID = (uint)Convert.ToInt32(textBox3.Text.ToString());
            byte runno = (byte)Convert.ToInt32(textBox16.Text.ToString());
            var Current = Convert.ToSingle(textBox4.Text.ToString());
            var Voltage = Convert.ToSingle(textBox5.Text.ToString());
            var Temperature = Convert.ToSingle(textBox6.Text.ToString());
            var WeldLength = Convert.ToSingle(textBox7.Text.ToString());
            var WireFeedRate = Convert.ToSingle(textBox8.Text.ToString());
            var GasUsed = Convert.ToSingle(textBox9.Text.ToString());

            var V_Current = Convert.ToSingle(textBox15.Text.ToString());
            var V_Voltage = Convert.ToSingle(textBox14.Text.ToString());
            var V_Temperature = Convert.ToSingle(textBox13.Text.ToString());
            var V_WeldLength = Convert.ToSingle(textBox12.Text.ToString());
            var V_WireFeedRate = Convert.ToSingle(textBox11.Text.ToString());
            var V_GasUsed = Convert.ToSingle(textBox10.Text.ToString());

            WeldData weldData = new WeldData(machineID, welderID, jobID, runno);
            RealTimeData realTimeData = new RealTimeData(Current, Voltage, Temperature, WeldLength, WireFeedRate, GasUsed);
            Variances variances = new Variances(V_Current, V_Voltage, V_Temperature, V_WeldLength, V_WireFeedRate, V_GasUsed);

            task = new TaskData(weldData, realTimeData, variances);

            Server.UpdateClient(task);
        }

        private void bindingNavigatorAddNewItem_Click(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            TaskData task;

            ushort machineID = (ushort)Convert.ToInt32(textBox1.Text.ToString());

            uint welderID = (uint)Convert.ToInt32(textBox2.Text.ToString());
            uint jobID = (uint)Convert.ToInt32(textBox3.Text.ToString());
            byte runno = (byte)Convert.ToInt32(textBox16.Text.ToString());
            var Current = Convert.ToSingle(textBox4.Text.ToString());
            var Voltage = Convert.ToSingle(textBox5.Text.ToString());
            var Temperature = Convert.ToSingle(textBox6.Text.ToString());
            var WeldLength = Convert.ToSingle(textBox7.Text.ToString());
            var WireFeedRate = Convert.ToSingle(textBox8.Text.ToString());
            var GasUsed = Convert.ToSingle(textBox9.Text.ToString());

            var V_Current = Convert.ToSingle(textBox15.Text.ToString());
            var V_Voltage = Convert.ToSingle(textBox14.Text.ToString());
            var V_Temperature = Convert.ToSingle(textBox13.Text.ToString());
            var V_WeldLength = Convert.ToSingle(textBox12.Text.ToString());
            var V_WireFeedRate = Convert.ToSingle(textBox11.Text.ToString());
            var V_GasUsed = Convert.ToSingle(textBox10.Text.ToString());

            WeldData weldData = new WeldData(machineID, welderID, jobID, runno);
            RealTimeData realTimeData = new RealTimeData(Current, Voltage, Temperature, WeldLength, WireFeedRate, GasUsed);
            Variances variances = new Variances(V_Current, V_Voltage, V_Temperature, V_WeldLength, V_WireFeedRate, V_GasUsed);

            task = new TaskData(weldData, realTimeData, variances);

            Server.UpdateClient(task);
        }

        private void button3_Click(object sender, EventArgs e)
        {
            ushort machineID = (ushort)Convert.ToInt32(textBox1.Text.ToString());

            Server.RemoveMachine(machineID);
        }
    }
}
