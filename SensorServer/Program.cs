using System;
using System.Threading;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Runtime.InteropServices;

namespace SensorServer
{
    readonly public struct WeldData
    {
        public WeldData (in ushort Machineid, in uint Welderid, in uint Jobid)
        {
            this.Machineid = Machineid;
            this.Welderid = Welderid;
            this.Jobid = Jobid;
        }

        public ushort Machineid { get; }
        public uint Welderid { get; }
        public uint Jobid { get; }

    }

    readonly public struct RealTimeData
    {

        public RealTimeData(in float Current, in float Voltage, in float Temperature, in float Length, in float WireFeedRate, in float GasUsed)
        {
            this.Current = Current;
            this.Voltage = Voltage;
            this.Temperature = Temperature;
            this.Length = Length;
            this.WireFeedRate = WireFeedRate;
            this.GasUsed = GasUsed;
        }

        public float Current { get; }
        public float Voltage { get; }
        public float Temperature { get; }
        public float Length { get; }
        public float WireFeedRate { get; }
        public float GasUsed { get; }
    }


    readonly public struct SensorDataStruct
    {
        public SensorDataStruct(in WeldData WD, in DateTime dateTime, in RealTimeData realTimeData)
        {
            this.Machineid = WD.Machineid;
            this.Welderid = WD.Welderid;
            this.Jobid = WD.Jobid;
            this.Second = (byte)dateTime.Second;
            this.Minute = (byte)dateTime.Minute;
            this.Hour = (byte)dateTime.Hour;
            this.Day = (byte)dateTime.Day;
            this.Month = (byte)dateTime.Month;
            this.Year = (ushort)dateTime.Year;
            this.Current = realTimeData.Current;
            this.Voltage = realTimeData.Voltage;
            this.Temperature = realTimeData.Temperature;
            this.Length = realTimeData.Length;
            this.WireFeedRate = realTimeData.WireFeedRate;
            this.GasUsed = realTimeData.GasUsed;

        }

        public ushort Machineid { get; }
        public uint Welderid { get; }
        public uint Jobid { get; }
        public byte Second { get; }
        public byte Minute { get; }
        public byte Hour { get; }
        public byte Day { get; }
        public byte Month { get; }
        public ushort Year { get; }
        public float Current { get; }
        public float Voltage { get; }
        public float Temperature { get; }
        public float Length { get; }
        public float WireFeedRate { get; }
        public float GasUsed { get; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            IPAddress ipAddress = IPAddress.Parse("127.0.0.1");
            IPEndPoint localEndPoint = new IPEndPoint(ipAddress, 8888);

            TcpListener serverSocket = new TcpListener(localEndPoint);
            TcpClient clientSocket = default(TcpClient);
            int counter = 0;

            serverSocket.Start();
            Console.WriteLine(" >> " + "Server Started");

            counter = 0;
            while (true)
            {
                counter += 1;
                clientSocket = serverSocket.AcceptTcpClient();
                Console.WriteLine(" >> " + "Client No:" + Convert.ToString(counter) + " started!");
                handleClient client = new handleClient();
                client.startClient(clientSocket, Convert.ToString(counter));
            }

            clientSocket.Close();
            serverSocket.Stop();
            Console.WriteLine(" >> " + "exit");
            Console.ReadLine();
        }
    }

    //Class to handle each client request separatly
    public class handleClient
    {
        TcpClient clientSocket;
        public void startClient(TcpClient inClientSocket, string clineNo)
        {
            this.clientSocket = inClientSocket;

            Thread ctThread = new Thread(Stream);
            ctThread.Start();
        }
        
        private void Stream()
        {
            string stream;

            stream = "This is the stream of data!\r\n";

            WeldData weldData = new WeldData(1, 1, 1024);

            while (this.clientSocket.Connected)
            {
                try
                {
                    NetworkStream networkStream = clientSocket.GetStream();

                    SensorDataStruct sensorData = this.CreateSensorData(weldData);

                    byte[] ByteStream = this.StructureToByteArray(sensorData);

                    networkStream.Write(ByteStream, 0, stream.Length);
                }

                catch (Exception ex)
                {
                    Console.WriteLine(" >> " + ex.ToString());
                }

            }
        }

        private SensorDataStruct CreateSensorData(in WeldData weldData)
        {
            DateTime dateTime = new DateTime();

            RealTimeData rtData = new RealTimeData(0.0f, 0.0f, 0.1f, 514.7f, 0.1f, 1.5f);

            SensorDataStruct Data = new SensorDataStruct(weldData, dateTime, rtData);

            return Data;
        }
        private byte[] StructureToByteArray(object obj)
        {
            int len = Marshal.SizeOf(obj);

            byte[] arr = new byte[len];

            IntPtr ptr = Marshal.AllocHGlobal(len);

            Marshal.StructureToPtr(obj, ptr, true);

            Marshal.Copy(ptr, arr, 0, len);

            Marshal.FreeHGlobal(ptr);

            return arr;
        }
    }
}
