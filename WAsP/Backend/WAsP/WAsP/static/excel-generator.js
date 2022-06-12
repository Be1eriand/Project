// From https://redstapler.co/sheetjs-tutorial-create-xlsx/

var wb = XLSX.utils.book_new();

wb.Props = {
    Title: "Productivity of Welder: "+ws_uid,
    Author: "SmartFab"
};

wb.SheetNames.push("Productivity_Data");

var ws = XLSX.utils.aoa_to_sheet(ws_data);

wb.Sheets["Productivity_Data"] = ws;

var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf); 
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

