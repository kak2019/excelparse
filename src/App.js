import React, { useState } from 'react';
import { read, utils, SSF } from 'xlsx';

const ExcelUploader = () => {
  const [excelData, setExcelData] = useState([]);

  const handleDrop = (acceptedFiles) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const { result } = event.target;
      const workbook = read(result, { type: 'binary', cellNF: true, });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      let data = utils.sheet_to_json(worksheet, { header: 1, raw: true, rawNumbers: true })
      
      data[1][4] = SSF.format('yyyy/mm/dd', data[1][4])

      data = data.filter(val => val.length > 0)
      console.log(data)
      
      // 格式化数据
      const formatData = {
        Date: data[1][4],
      }
      data.slice(3, 26).forEach(val => {
        formatData[val[0].replace(':', '')] = val[2]
      })
      debugger
      setExcelData(formatData);
    };
    fileReader.readAsBinaryString(acceptedFiles[0]);
  };

  return (
    <div>
        {
          <div >
            <input type='file' onChange={(e) => {
              handleDrop(e.target.files)
            }} />
            <p>将Excel文件拖放到此处，或点击选择文件</p>
          </div>
        }
        <div>
          { JSON.stringify(excelData)}
        </div>
    </div>
  );
};

export default ExcelUploader;
