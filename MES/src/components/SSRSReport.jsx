import React from 'react';

const SSRSReport = () => {
  const reportUrl = encodeURI(
    "http://nitrov/Reports/browse/"
  );

  return (
    <div style={{ height: '100vh' }}>
      <iframe
        title="SSRS Report"
        src={reportUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
};

export default SSRSReport;
