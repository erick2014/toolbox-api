const expect = require("chai").expect;
const cleanUpData = require("../utils/dataCleaner");

describe("Data cleaner util", () => {
  it("Should return empty lines if status is 500", () => {
    const response = cleanUpData({
      "test4.csv":
        '{"code":"API-500","message":"File error","details":"FILE_ERROR","status":500}',
    });
    expect(response).to.deep.equal([{ file: "test4.csv", lines: [] }]);
  });

  it("Should return empty lines if status is 404", () => {
    const response = cleanUpData({
      "test5.csv":
        '{"code":"SYS-ERR","message":"Not Found","details":null,"status":404}',
    });
    expect(response).to.deep.equal([{ file: "test5.csv", lines: [] }]);
  });

  it("should filter line by 'file' column", () => {
    const fakeResponseTest = `file,text,number,hex\ntest3.csv,JNnhk\ntest6.csv,uuXEIYOAlWBJEkofrTLhoLZEMO,20679,47b4f6036704191eb4d17a943dd338d5\ntest3.csv,KubYIze,83321,c0e45e55c5d21a7e5d5c04b87f0e63ea\ntest3.csv,bQsOmMBgoKiUarZqzjWViP,423886482,a709a10752f1c307990f1400b2082017\n`;
    const response = cleanUpData({ "test6.csv": fakeResponseTest });
    const expectedResponsehere = [
      {
        file: "test6.csv",
        lines: [
          {
            text: "uuXEIYOAlWBJEkofrTLhoLZEMO",
            number: "20679",
            hex: "47b4f6036704191eb4d17a943dd338d5",
          },
        ],
      },
    ];
    expect(response).to.deep.equal(expectedResponsehere);
  });

  it("should filter line by 'number' column", () => {
    const fakeResponse =
      "file,text,number,hex\ntest6.csv,PQfJc\ntest6.csv,JQPGRTimWDlM,33520188o,9b0709178db5efbaf0ee4708b7cd541c\ntest6.csv,SLoAdCwi,6o,cff857cf15692294b8a85fcea9aec5b0\ntest6.csv,DhsntV,5o,20b45ceb8b814fe22e5677b3df318f07\ntest6.csv,gfbZlQHfeOsxUWLOmouvwEyqN,040o,2ce016a3a06edd131cefd1dbb9a73569\ntest6.csv,QxEzDnByGcZBzTADsyUh,681847o,32f2f0833809f5381221c5c1e22cf3e9\ntest6.csv,JVmKHhzzAjywvOQcbdvUj,62692408561865281942959302595880o,767c2277c02dfdcc8c76e25b74ca9e17\ntest6.csv,ngrIAYsSXKiDxLOVs,4o,2cef88e6d9ebd2f75533ddedda6bdee6\ntest6.csv,OWaukorffzpHxRPLksjsuYyvWnVwu,3o,5137413551a87ec7e8d7e01ed5b9704c\ntest6.csv,jKCAF\ntest6.csv,SAQNmIYqwafcFpEJwgurxgPdnHRAiQnj,05745015849574120461778944073902o,6d55e96dffdf5646003f09528fad13f7\ntest6.csv,xnlkfqKysDP,856o,46ea75034c13994f7bf1ebfa9ca06248";
    const response = cleanUpData({
      "test6.csv": fakeResponse,
    });
    expect(response).to.deep.equal([{ file: "test6.csv", lines: [] }]);
  });

  it("should filter line by 'hex' column", () => {
    const fakeResponse =
      "file,text,number,hex\ntest18.csv,FTqc\ntest18.csv,aDBHwweAySBZqaV,79,jz778f18c6d5c41320c8ed8043849c\ntest18.csv,xONCtBsOzWpdw,82852,jz216a52a0848cf313984c4232f42e\ntest18.csv,iZMGmUi,19652,jz6ed57c37fc2bd8f804e1c6b65cf3\ntest18.csv,VjNLcxUfFXWZcRLwHQsBBmxj,6215,jz884d0dddb6b0e90415d00c2be2af\ntest18.csv,DykoIfMHmaBPs,5020,jzc5ad2d0c4eee1618d17b5e26e1c6";
    const response = cleanUpData({
      "test18.csv": fakeResponse,
    });
    expect(response).to.deep.equal([{ file: "test18.csv", lines: [] }]);
  });

  it("should return valid lines", () => {
    const fakeResponse =
      "file,text,number,hex\nfile1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765\nfile1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5\nfile1.csv,PNzRfORtKtEDOzmIVrQuSh,74088708,3e29651a63a5202a5661e05a060401fb\nfile1.csv,d,6173,f9e1bcdb9e3784acc448af34f4727252";
    const response = cleanUpData({
      "file1.csv": fakeResponse,
    });
    const expectResponse = [
      {
        file: "file1.csv",
        lines: [
          {
            text: "RgTya",
            number: "64075909",
            hex: "70ad29aacf0b690b0467fe2b2767f765",
          },
          {
            text: "AtjW",
            number: "6",
            hex: "d33a8ca5d36d3106219f66f939774cf5",
          },
          {
            text: "PNzRfORtKtEDOzmIVrQuSh",
            number: "74088708",
            hex: "3e29651a63a5202a5661e05a060401fb",
          },
          {
            text: "d",
            number: "6173",
            hex: "f9e1bcdb9e3784acc448af34f4727252",
          },
        ],
      },
    ];
    expect(response).to.deep.equal(expectResponse);
  });
});
