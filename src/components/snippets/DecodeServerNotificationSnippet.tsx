import SnippetsStyles from './SnippetStyles';

const GetPhpRawSnippet = () => {
  const styles = SnippetsStyles();
  return (
    <div className={styles.snippetScrollable}>
      <div
        className={styles.text}
        style={{
          left: '0px',
          top: '0px',
          fontSize: '14px',
          fontFamily: 'Courier New',
          fontWeight: 400,
          lineHeight: 1.4,
          wordWrap: 'break-word',
          userSelect: 'none',
        }}
      >
        1 <br />2 <br />3 <br />4 <br />5 <br />6 <br />7 <br />8 <br />9 <br />
        10 <br />
        11 <br />
        12 <br />
        13 <br />
        14 <br />
        15 <br />
        16 <br />
        17 <br />
        18 <br />
        19 <br />
        20 <br />
        21 <br />
        22 <br />
        23 <br />
      </div>
      <div className={styles.rows}>
        <p>
          <span className={styles.blue}>{'<?php'}</span>
        </p>
        <br />
        <br />
        <p>
          <span>$apiKey =</span>
          <span className={styles.orange}>''</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$storeId =</span>
          <span className={styles.orange}>''</span>
          <span>;</span>
        </p>
        <br />
        <br />
        <p>
          <span>$data = file_get_contents</span>
          <span className={styles.yellow}>(</span>
          <span className={styles.orange}>'php://input'</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$data = json_decode</span>
          <span className={styles.yellow}>(</span>
          <span>$data,&nbsp;</span>
          <span className={styles.blue}>true</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$data = $data</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'data'</span>
          <span className={styles.yellow}>]</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$data = urldecode</span>
          <span className={styles.yellow}>(</span>
          <span>$data</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$data = base64_decode</span>
          <span className={styles.yellow}>(</span>
          <span>$data</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$iv &nbsp; = substr</span>
          <span className={styles.yellow}>(</span>
          <span>$data,&nbsp;</span>
          <span className={styles.green}>0</span>
          <span>,&nbsp;</span>
          <span className={styles.green}>16</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$data = substr</span>
          <span className={styles.yellow}>(</span>
          <span>$data,&nbsp;</span>
          <span className={styles.green}>16</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$data = openssl_decrypt</span>
          <span className={styles.yellow}>(</span>
          <span>$data,&nbsp;</span>
          <span className={styles.orange}>'aes-256-cbc'</span>
          <span>,</span>
        </p>
        <br />
        <p>
          <span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span>$apiKey, OPENSSL_RAW_DATA, $iv</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$data = json_decode</span>
          <span className={styles.yellow}>(</span>
          <span>$data,&nbsp;</span>
          <span className={styles.blue}>true</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <br />
        <p>
          <span>$data</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'transactionId'</span>
          <span className={styles.yellow}>]</span>
          <span>;</span>
          <span className={styles.green}>&nbsp;// Bitsidy transaction ID</span>
        </p>
        <br />
        <p>
          <span>$data</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'orderId'</span>
          <span className={styles.yellow}>]</span>
          <span>;</span>
          <span className={styles.green}>&nbsp;// your local invoice ID</span>
        </p>
        <br />
        <p>
          <span>$data</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'invoiceAmount'</span>
          <span className={styles.yellow}>]</span>
          <span>;</span>
          <span className={styles.green}>&nbsp;// 0.000123 in BTC</span>
        </p>
        <br />
        <p>
          <span>$data</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'invoiceAmountUsd'</span>
          <span className={styles.yellow}>]</span>
          <span>;</span>
          <span className={styles.green}>&nbsp;// 100 in USD</span>
        </p>
        <br />
        <p>
          <span>$data</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'customString'</span>
          <span className={styles.yellow}>]</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$data</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'receivedAmount'</span>
          <span className={styles.yellow}>]</span>
          <span>;</span>
          <span className={styles.green}>&nbsp;// 0.000123 in BTC</span>
        </p>
        <br />
        <p>
          <span>$data</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'status'</span>
          <span className={styles.yellow}>]</span>
          <span>;</span>
          <span className={styles.green}>&nbsp;// success, underpaid, etc</span>
        </p>
      </div>
    </div>
  );
};

const DecodeServerNotificationSnippet = ({ lang }: { lang: string }) => {
  const styles = SnippetsStyles();
  let component = <></>;
  switch (lang) {
    case 'phpraw':
      component = GetPhpRawSnippet();
  }

  return <div className={styles.snippetContainer}>{component}</div>;
};

export default DecodeServerNotificationSnippet;
