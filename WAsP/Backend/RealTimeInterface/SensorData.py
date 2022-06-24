# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

from pkg_resources import parse_version
import kaitaistruct
from kaitaistruct import KaitaiStruct #, KaitaiStream, BytesIO


if parse_version(kaitaistruct.__version__) < parse_version('0.9'):
    raise Exception("Incompatible Kaitai Struct Python API: 0.9 or later is required, but you have %s" % (kaitaistruct.__version__))

class SensorData(KaitaiStruct):
    def __init__(self, _io, _parent=None, _root=None):
        self._io = _io
        self._parent = _parent
        self._root = _root if _root else self
        self._read()

    def _read(self):
        self.machineid = self._io.read_u2le()
        self.welderid = self._io.read_u4le()
        self.taskid = self._io.read_u4le()
        self.runid = self._io.read_u1()
        self.time = SensorData.Time(self._io, self, self._root)
        self.date = SensorData.Date(self._io, self, self._root)
        self.rtdata = SensorData.Data(self._io, self, self._root)

    class Time(KaitaiStruct):
        def __init__(self, _io, _parent=None, _root=None):
            self._io = _io
            self._parent = _parent
            self._root = _root if _root else self
            self._read()

        def _read(self):
            self.second = self._io.read_u4le()
            if not self.second <= 59999:
                raise kaitaistruct.ValidationGreaterThanError(59999, self.second, self._io, u"/types/time/seq/0")
            self.minute = self._io.read_u1()
            if not self.minute <= 59:
                raise kaitaistruct.ValidationGreaterThanError(59, self.minute, self._io, u"/types/time/seq/1")
            self.hour = self._io.read_u1()
            if not self.hour <= 23:
                raise kaitaistruct.ValidationGreaterThanError(23, self.hour, self._io, u"/types/time/seq/2")

    class Date(KaitaiStruct):
        def __init__(self, _io, _parent=None, _root=None):
            self._io = _io
            self._parent = _parent
            self._root = _root if _root else self
            self._read()

        def _read(self):
            self.day = self._io.read_u1()
            if not self.day >= 1:
                raise kaitaistruct.ValidationLessThanError(1, self.day, self._io, u"/types/date/seq/0")
            if not self.day <= 31:
                raise kaitaistruct.ValidationGreaterThanError(31, self.day, self._io, u"/types/date/seq/0")
            self.month = self._io.read_u1()
            if not self.month >= 0:
                raise kaitaistruct.ValidationLessThanError(0, self.month, self._io, u"/types/date/seq/1")
            if not self.month <= 12:
                raise kaitaistruct.ValidationGreaterThanError(12, self.month, self._io, u"/types/date/seq/1")
            self.year = self._io.read_u4le()

    class Data(KaitaiStruct):
        def __init__(self, _io, _parent=None, _root=None):
            self._io = _io
            self._parent = _parent
            self._root = _root if _root else self
            self._read()

        def _read(self):
            self.current = self._io.read_u4le()
            self.voltage = self._io.read_u4le()
            self.temperature = self._io.read_u4le()
            self.length = self._io.read_u4le()
            self.wirefeedrate = self._io.read_u4le()
            self.gasused = self._io.read_u4le()
