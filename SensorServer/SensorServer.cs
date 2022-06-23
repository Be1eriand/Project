using System;
using System.Collections.Generic;
using System.Threading;
using System.Net.Sockets;
using System.Net;
using System.IO;
using System.Collections.Concurrent;

namespace SensorServer
{
    public class TaskData
    {
        public TaskData(WeldData WD, RealTimeData realTimeData, Variances variances)
        {
            Machineid = WD.Machineid;
            Welderid = WD.Welderid;
            Jobid = WD.Jobid;
            Runid = WD.Runid;
            Current = realTimeData.Current;
            Voltage = realTimeData.Voltage;
            Temperature = realTimeData.Temperature;
            WeldLength = realTimeData.WeldLength;
            WireFeedRate = realTimeData.WireFeedRate ;
            GasUsed = realTimeData.GasUsed;
            Variance = variances;
        }

        public ushort Machineid { get; set; }
        public uint Welderid { get; set; }
        public uint Jobid { get; set; }
        public byte Runid { get; set; }
        public float Current { get; set; }
        public float Voltage { get; set; }
        public float Temperature { get; set; }
        public float WeldLength { get; set; }
        public float WireFeedRate { get; set; }
        public float GasUsed { get; set; }
        public Variances Variance { get; set; }

    }

    readonly public struct WeldData
    {
        public WeldData(in ushort Machineid, in uint Welderid, in uint Jobid, in byte Runid)
        {
            this.Machineid = Machineid;
            this.Welderid = Welderid;
            this.Jobid = Jobid;
            this.Runid = Runid;
        }

        public ushort Machineid { get; }
        public uint Welderid { get; }
        public uint Jobid { get; }
        public byte Runid { get; }

    }

    readonly public struct Variances
    {
        public Variances (in float Current, in float Voltage, in float Temperature, in float WeldLength, in float WireFeedRate, in float GasUsed)
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
            var RunNo = WD.Runid;
            var Year = BitConverter.GetBytes(dateTime.Year);
            var Current = BitConverter.GetBytes(Convert.ToInt32(realTimeData.Current * 1000));
            var Voltage = BitConverter.GetBytes(Convert.ToInt32(realTimeData.Voltage * 1000));
            var Temperature = BitConverter.GetBytes(Convert.ToInt32(realTimeData.Temperature * 1000));
            var WeldLength = BitConverter.GetBytes(Convert.ToInt32(realTimeData.WeldLength * 1000));
            var WireFeedRate = BitConverter.GetBytes(Convert.ToInt32(realTimeData.WireFeedRate * 1000));
            var GasUsed = BitConverter.GetBytes(Convert.ToInt32(realTimeData.GasUsed * 1000));


            Console.WriteLine("Run No: {0:N}", RunNo);

            ByteArray = new byte[47]; //Must adjust this everytime

            int i = 0;
            for (int j = 0; j < 2; j++)
            {
                ByteArray[i] = Machineid[j];
                i++;
            }

            for (int j = 0; j < 4; j++)
            {
                ByteArray[i] = Welderid[j];
                i++;
            }

            for (int j = 0; j < 4; j++)
            {
                ByteArray[i] = Jobid[j];
                i++;
            }

            ByteArray[i] = RunNo;
            i++;

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
            for (int j = 0; j < 4; j++)
            {
                ByteArray[i] = Current[j];
                i++;
            }

            for (int j = 0; j < 4; j++)
            {
                ByteArray[i] = Voltage[j];
                i++;
            }

            for (int j = 0; j < 4; j++)
            {
                ByteArray[i] = Temperature[j];
                i++;
            }

            for (int j = 0; j < 4; j++)
            {
                ByteArray[i] = WeldLength[j];
                i++;
            }

            for (int j = 0; j < 4; j++)
            {
                ByteArray[i] = WireFeedRate[j];
                i++;
            }

            for (int j = 0; j < 4; j++)
            {
                ByteArray[i] = GasUsed[j];
                i++;
            }
        }

        public byte[] ByteArray { get; }
    }

    class SensorServer
    {
        TcpClient ClientSocket;
        HandleClient client;

        public SensorServer(string address, int port)
        {
            //Below is not needed for now. Will leave in case of future requirements
            IPAddress ipAddress = IPAddress.Parse(address);
            IPEndPoint localEndPoint = new IPEndPoint(ipAddress, port);
        }

        public void Start()
        {
            Console.WriteLine(" >> " + "Server Started");
        }

        public void Serve()
        {
            while (true)
            {
                ClientSocket = new TcpClient();  //ServerSocket.AcceptTcpClient();
                Console.WriteLine(" >> " + "Connecting to the RTI");
                ClientSocket.Connect("127.0.0.1", 8888); //Connecting to a Local client
                Console.WriteLine(" >> " + "Client connected!");
                client = new HandleClient();
                client.startClient(ClientSocket);
            }
        }

        public void Stop()
        {
            ClientSocket.Close();
            Console.WriteLine(" >> " + "exit");
            Console.ReadLine();
        }

        public void UpdateClient(TaskData task)
        {
            client.UpdateData(task);
        }

        public void RemoveMachine(ushort machineid)
        {
            client.RemoveData(machineid);
        }
    }

    //Class to handle each client request separately
    public class HandleClient
    {
        TcpClient clientSocket;
        static readonly Random NumGenerator = new Random();
        List<TaskData> TaskDataList = new List<TaskData>();
        TaskData _Task;


        public HandleClient()
        {
        }

        public void startClient(TcpClient inClientSocket)
        {
            clientSocket = inClientSocket;
            Stream();
        }

        public void stopClient()
        {
            Console.WriteLine("Timer is Disposed");
        }

        public void UpdateData(in TaskData task)
        {
            lock (TaskDataList)
            {
                var i = task.Machineid;
                if ((TaskDataList.Count > 0))
                {
                    var TD = TaskDataList.Find(
                        delegate (TaskData td)
                        {
                            return td.Machineid == i;
                        }
                    );

                    if (TD != null)
                    {
                        TD.Machineid = task.Machineid;
                        TD.Welderid = task.Welderid;
                        TD.Jobid = task.Jobid;
                        TD.Runid = task.Runid;
                        TD.Current = task.Current;
                        TD.Voltage = task.Voltage;
                        TD.Temperature = task.Temperature;
                        TD.WeldLength = task.WeldLength;
                        TD.WireFeedRate = task.WireFeedRate;
                        TD.GasUsed = task.GasUsed;
                        TD.Variance = task.Variance;
                    } else
                    {
                        WeldData weldData = new WeldData(task.Machineid, task.Welderid, task.Jobid, task.Runid);
                        RealTimeData realTimeData = new RealTimeData(task.Current, task.Voltage, task.Temperature, task.WeldLength, task.WireFeedRate, task.GasUsed);
                        var v = task.Variance;
                        Variances variances = new Variances(v.Current, v.Voltage, v.Temperature, v.WeldLength, v.WireFeedRate, v.GasUsed);

                        _Task = new TaskData(weldData, realTimeData, variances);

                        TaskDataList.Add(_Task);
                    }

                } else {
                    WeldData weldData = new WeldData(task.Machineid, task.Welderid, task.Jobid, task.Runid);
                    RealTimeData realTimeData = new RealTimeData(task.Current, task.Voltage, task.Temperature, task.WeldLength, task.WireFeedRate, task.GasUsed);
                    var v = task.Variance;
                    Variances variances = new Variances(v.Current, v.Voltage, v.Temperature, v.WeldLength, v.WireFeedRate, v.GasUsed);

                    _Task = new TaskData(weldData, realTimeData, variances);

                    TaskDataList.Add(_Task);
                }
            }
        }

        public void RemoveData(in int Machineid)
        {
            lock (TaskDataList)
            {
                var i = Machineid;
                if ((TaskDataList.Count > 0))
                {
                    var TD = TaskDataList.Find(
                        delegate (TaskData td)
                        {
                            return td.Machineid == i;
                        }
                    );

                    if (TD != null)
                    {
                        TaskDataList.Remove(TD);
                    }
                }
            }   
        }

        private void Stream() //I can change this to have parameters
        {
            Random randomNumber = new Random();

            while (clientSocket.Connected)
            {
                Thread.Sleep(1000);
                SendData();
            }

            Console.WriteLine("Client Disconnected");

        }

        private void SendData()
        {
            try
            {
                NetworkStream networkStream = clientSocket.GetStream();

                lock (TaskDataList)
                {
                    if (TaskDataList.Count > 0)
                    {
                        Console.WriteLine("Task Data List!");
                        foreach (TaskData task in TaskDataList)
                        {
                            SensorDataStruct sensorData = CreateSensorData(task);

                            networkStream.Write(sensorData.ByteArray, 0, sensorData.ByteArray.Length);
                        }

                        Console.WriteLine("Data has been sent");
                    }
                }
            }

            catch (IOException)
            {
                Console.WriteLine("Timer is Disposed");

                Console.WriteLine(" >> Client has closed the connection");
                clientSocket.Close();
            }

            catch (Exception ex)
            {
                Console.WriteLine(" >> " + ex.ToString());
            }
        }

        private SensorDataStruct CreateSensorData(in TaskData task)
        {
            DateTime dateTime = DateTime.Now;

            var voltage = (float)NormalisedRandomNumber(task.Voltage, task.Variance.Voltage);
            var current = (float)NormalisedRandomNumber(task.Current, task.Variance.Current);
            var wfr = (float)NormalisedRandomNumber(task.WireFeedRate, task.Variance.WireFeedRate);
            var gasused = (float)NormalisedRandomNumber(task.GasUsed, task.Variance.GasUsed);
            var temperature = (float)NormalisedRandomNumber(task.Temperature, task.Variance.Temperature);
            var WeldLength = (float)NormalisedRandomNumber(task.WeldLength, task.Variance.WeldLength);

            RealTimeData realTimeData = new RealTimeData(current, voltage, temperature, WeldLength, wfr, gasused);
            WeldData weldData = new WeldData(task.Machineid, task.Welderid, task.Jobid, task.Runid);

            return new SensorDataStruct(weldData, dateTime, realTimeData);
        }

        private static double NormalisedRandomNumber(in double mu, in double sigma) //Is this thread safe?
        {
            var NormalisedNumberArray = BoxMuellerMethod();

            var RandomNumber = NormalisedNumberArray.Item1 * sigma + mu; //Just selecting the first one, could have easily chosen the second

            return RandomNumber;
        }

        private static (double, double) BoxMuellerMethod()
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
