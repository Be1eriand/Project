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
            var Machineid = BitConverter.GetBytes(WD.Machineid);
            var Welderid = BitConverter.GetBytes(WD.Welderid);
            var Jobid = BitConverter.GetBytes(WD.Jobid);
            var Year = BitConverter.GetBytes(dateTime.Year);
            var Current = BitConverter.GetBytes(Convert.ToInt32(realTimeData.Current*1000));
            var Voltage = BitConverter.GetBytes(Convert.ToInt32(realTimeData.Voltage * 1000));
            var Temperature = BitConverter.GetBytes(Convert.ToInt32(realTimeData.Temperature * 1000));
            var WeldLength = BitConverter.GetBytes(Convert.ToInt32(realTimeData.WeldLength * 1000));
            var WireFeedRate = BitConverter.GetBytes(Convert.ToInt32(realTimeData.WireFeedRate * 1000));
            var GasUsed = BitConverter.GetBytes(Convert.ToInt32(realTimeData.GasUsed * 1000));

            ByteArray = new byte[46]; //Must adjust this everytime

            int i = 0;
            for (int j = 0; j < 2; j++)
            {
                ByteArray[i] = Machineid[j];
                i++;
            }

            for(int j = 0; j < 4 ; j++)
            {
                ByteArray[i] = Welderid[j];
                i++;
            }

            for (int j = 0; j < 4; j++)
            {
                ByteArray[i] = Jobid[j];
                i++;
            }

            var Seconds = BitConverter.GetBytes(Convert.ToInt32((dateTime.Second * 1000 + dateTime.Millisecond)));

            for (int j = 0; j < 4; j++)
            {
                ByteArray[i] = Seconds[j];
                i++;
            }

            ByteArray[i] = Convert.ToByte(dateTime.Minute);
            i++;
            ByteArray[i] = Convert.ToByte(dateTime.Hour);
            i++;
            ByteArray[i] = Convert.ToByte(dateTime.Day);
            i++;
            ByteArray[i] = Convert.ToByte(dateTime.Month);
            i++;

            for (int j = 0; j < 4; j++)
            {
                ByteArray[i] = Year[j]; 
                i++;
            }
            for (int j = 0; j < 4 ; j++)
            {
                ByteArray[i] = Current[j];
                i++;
            }

            for (int j = 0; j < 4 ; j++)
            {
                ByteArray[i] = Voltage[j];
                i++;
            }

            for (int j = 0; j < 4 ; j++)
            {
                ByteArray[i] = Temperature[j];
                i++;
            }

            for (int j = 0; j < 4 ; j++)
            {
                ByteArray[i] = WeldLength[j];
                i++;
            }

            for (int j = 0; j < 4 ; j++)
            {
                ByteArray[i] = WireFeedRate[j];
                i++;
            }

            for (int j = 0; j < 4 ; j++)
            {
                ByteArray[i] = GasUsed[j];
                i++;
            }
}

        public byte[] ByteArray { get; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            IPAddress ipAddress = IPAddress.Parse("127.0.0.1");
            IPEndPoint localEndPoint = new IPEndPoint(ipAddress, 8888);

            TcpListener ServerSocket = new TcpListener(localEndPoint);
            TcpClient ClientSocket;
            int counter;

            ServerSocket.Start();
            Console.WriteLine(" >> " + "Server Started");

            counter = 0;
            while (true)
            {
                counter += 1;
                ClientSocket = ServerSocket.AcceptTcpClient();
                Console.WriteLine(" >> " + "Client No:" + Convert.ToString(counter) + " started!");
                HandleClient client = new HandleClient();
                client.startClient(ClientSocket);
            }

            ClientSocket.Close();
            ServerSocket.Stop();
            Console.WriteLine(" >> " + "exit");
            Console.ReadLine();
        }
    }

    //Class to handle each client request separately
    public class HandleClient
    {
        TcpClient clientSocket;
        static readonly Random NumGenerator = new Random();

        public void startClient(TcpClient inClientSocket)
        {
            clientSocket = inClientSocket;

            Thread ctThread = new Thread(Stream);
            ctThread.Start(); //I can add parameters here
            //Stream();
        }
        
        private void Stream() //I can change this to have paramaters
        {
            List<WeldData> WeldDataList = new List<WeldData>();

            Random randomNumber = new Random();

            for (ushort machineID = 1; machineID < 5; machineID++)
            {
                uint welderID = (uint)randomNumber.Next();
                uint jobID = (uint)randomNumber.Next();

                WeldDataList.Add(new WeldData(machineID, welderID, jobID));
            }

            while (clientSocket.Connected)
            {
                try
                {
                    NetworkStream networkStream = clientSocket.GetStream();

                    foreach (WeldData weldData in WeldDataList) 
                    {
                        SensorDataStruct sensorData = CreateSensorData(weldData);

                        networkStream.Write(sensorData.ByteArray, 0, sensorData.ByteArray.Length);

                        var path = @"file.txt";

                        using (var fs = new FileStream(path, FileMode.Create, FileAccess.Write))
                        {
                           fs.Write(sensorData.ByteArray, 0, sensorData.ByteArray.Length);
                        }
                    }
                }

                catch (IOException)
                {
                    Console.WriteLine(" >> Client has closed the connection");
                    clientSocket.Close();
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

            var voltage = (float)NormalisedRandomNumber(24.0, 0.05);
            var current = (float)NormalisedRandomNumber(100.0, 0.2);
            var wfr = (float)NormalisedRandomNumber(50.0, 0.5);
            var gasused = (float)NormalisedRandomNumber(1.0, 0.01);
            var temperature = (float)NormalisedRandomNumber(3000.0, 100.0);
            var WeldLength = 1.0f;


            RealTimeData realTimeData = new RealTimeData(current, voltage, temperature, WeldLength, wfr, gasused);

            SensorDataStruct Data = new SensorDataStruct(weldData, dateTime, realTimeData);

            return Data;
        }

        private static double NormalisedRandomNumber(in double mu, in double sigma) //Is this thread safe?
        {
            var NormalisedNumberArray = BoxMuellerMethod();

            var RandomNumber = NormalisedNumberArray.Item1 * sigma + mu; //Just selecting the first one, could have easily chosen the second

            return RandomNumber;
        }

        private static (double,double) BoxMuellerMethod()
        {
            //Uses the Box-Mueller Method
            //See https://rh8liuqy.github.io/Box_Muller_Algorithm.html
            //Box-Mueller method is quick and efficient at generating normalised numbers

            var rand1 = NumGenerator.NextDouble();
            var rand2 = NumGenerator.NextDouble();

            var R = Math.Sqrt(-2 * Math.Log(rand1));
            var Theta = 2 * Math.PI * rand2;

            var X = R * Math.Cos(Theta);
            var Y = R * Math.Sin(Theta);

            return (X, Y);
        }

    }
}
