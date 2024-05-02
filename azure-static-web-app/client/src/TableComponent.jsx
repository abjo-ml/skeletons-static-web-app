import React from 'react';

const TableComponent = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const headers = Object.keys(data[0] || {});

  return (
    <table>
      <thead>
        <tr>
          {headers.map(header => <th key={header}>{header}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, cellIndex) => <td key={cellIndex}>{row[header]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
