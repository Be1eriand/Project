using System;
using System.Collections.Generic;
using System.Threading;
using System.Net.Sockets;
using System.Net;
using System.Runtime.InteropServices;
using System.IO;

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

        public RealTimeData(in float Current, in float Voltage, in float Temperature, in float WeldLength, in float WireFeedRate, in float GasUsed)
        {
            this.Current = Current;
            this.Voltage = Voltage;
            this.Temperature = Temperature;
            this.WeldLength = WeldLength;
            this.WireFeedRate = WireFeedRate;
            this.GasUsed = GasUsed;
        }

        public float Current { get; }
        public float Voltage { get; }
        public float Temperature { get; }
        public float WeldLength { get; }
        public float WireFeedRate { get; }
        public float GasUsed { get; }
    }


    readonly public struct SensorDataStruct
    {
        public SensorDataStruct(in WeldData WD, in DateTime dateTime, in RealTimeData realTimeData)
        {
            this.Machineid = BitConverter.GetBytes(WD.Machineid);
            this.Welderid = BitConverter.GetBytes(WD.Welderid);
            this.Jobid = BitConverter.GetBytes(WD.Jobid);
            this.Second = Convert.ToByte(dateTime.Second);
            this.Minute = Convert.ToByte(dateTime.Minute);
            this.Hour = Convert.ToByte(dateTime.Hour);
            this.Day = Convert.ToByte(dateTime.Day);
            this.Month = Convert.ToByte(dateTime.Month);
            this.Year = BitConverter.GetBytes(dateTime.Year);
            this.Current = BitConverter.GetBytes(realTimeData.Current);
            this.Voltage = BitConverter.GetBytes(realTimeData.Voltage);
            this.Temperature = BitConverter.GetBytes(realTimeData.Temperature);
            this.WeldLength = BitConverter.GetBytes(realTimeData.WeldLength);
            this.WireFeedRate = BitConverter.GetBytes(realTimeData.WireFeedRate);
            this.GasUsed = BitConverter.GetBytes(realTimeData.GasUsed);

            this.ByteArray = new byte[43];

            int i = 0;
            for (int j = 0; j < 2; j++)
            {
                this.ByteArray[i] = this.Machineid[j];
                i++;
            }

            for(int j = 0; j < 4 ; j++)
            {
                this.ByteArray[i] = this.Welderid[j];
                i++;
            }

            for (int j = 0; j < 4; j++)
            {
                this.ByteArray[i] = this.Jobid[j];
                i++;
            }

            this.ByteArray[i] = this.Second;
            i++;
            this.ByteArray[i] = this.Minute;
            i++;
            this.ByteArray[i] = this.Hour;
            i++;
            this.ByteArray[i] = this.Day;
            i++;
            this.ByteArray[i] = this.Month;
            i++;

            for (int j = 0; j < 4; j++)
            {
                this.ByteArray[i] = this.Year[j]; 
                i++;
            }
            for (int j = 0; j < 4 ; j++)
            {
                this.ByteArray[i] = this.Current[j];
                i++;
            }

            for (int j = 0; j < 4 ; j++)
            {
                this.ByteArray[i] = this.Voltage[j];
                i++;
            }

            for (int j = 0; j < 4 ; j++)
            {
                this.ByteArray[i] = this.Temperature[j];
                i++;
            }

            for (int j = 0; j < 4 ; j++)
            {
                this.ByteArray[i] = this.WeldLength[j];
                i++;
            }

            for (int j = 0; j < 4 ; j++)
            {
                this.ByteArray[i] = this.WireFeedRate[j];
                i++;
            }

            for (int j = 0; j < 4 ; j++)
            {
                this.ByteArray[i] = this.GasUsed[j];
                i++;
            }
}

        public byte[] Machineid { get; }
        public byte[] Welderid { get; }
        public byte[] Jobid { get; }
        public byte Second { get; }
        public byte Minute { get; }
        public byte Hour { get; }
        public byte Day { get; }
        public byte Month { get; }
        public byte[] Year { get; }
        public byte[] Current { get; }
        public byte[] Voltage { get; }
        public byte[] Temperature { get; }
        public byte[] WeldLength { get; }
        public byte[] WireFeedRate { get; }
        public byte[] GasUsed { get; }
        public byte[] ByteArray { get; }
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
            //Stream();
        }
        
        private void Stream()
        {
            List<WeldData> WeldDataList = new List<WeldData>();

            Random randomNumber = new Random();

            for (ushort machineID = 1; machineID < 5; machineID++)
            {
                uint welderID = (uint)randomNumber.Next(2147483647);
                uint jobID = (uint)randomNumber.Next(2147483647);

                WeldDataList.Add(new WeldData(machineID, welderID, jobID));
            }

            while (this.clientSocket.Connected)
            {
                try
                {
                    NetworkStream networkStream = clientSocket.GetStream();

                    foreach (WeldData weldData in WeldDataList) 
                    {
                        SensorDataStruct sensorData = this.CreateSensorData(weldData);

                        networkStream.Write(sensorData.ByteArray, 0, sensorData.ByteArray.Length);

                        var path = @"file.txt";

                        using (var fs = new FileStream(path, FileMode.Create, FileAccess.Write))
                        {
                            fs.Write(sensorData.ByteArray, 0, sensorData.ByteArray.Length);
                        }
                    }
                }

                catch (Exception ex)
                {
                    Console.WriteLine(" >> " + ex.ToString());
                }

            }
        }

        private SensorDataStruct CreateSensorData(in WeldData weldData)
        {
            DateTime dateTime = DateTime.Now;

            RealTimeData realTimeData = new RealTimeData(1.0f, 2.0f, 4.0f, 8.0f, 16.0f, 32.0f);

            SensorDataStruct Data = new SensorDataStruct(weldData, dateTime, realTimeData);

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
