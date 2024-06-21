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
      </div>{' '}
      <div className={styles.rows}>
        <p>
          <span className={styles.blue}>{'<?php'}</span>
        </p>
        <br />
        <br />
        <p>
          <span>$apiKey =&nbsp;</span>
          <span className={styles.orange}>''</span>
          <span>;&nbsp;</span>
          <span className={styles.green}>// API key of your store</span>
        </p>
        <br />
        <p>
          <span>$storeId =&nbsp;</span>
          <span className={styles.orange}>''</span>
          <span>;&nbsp;</span>
          <span className={styles.green}>// ID of your store</span>
        </p>
        <br />
        <p>
          <span>$data =&nbsp;</span>
          <span className={styles.yellow}>[</span>
          <span>...</span>
          <span className={styles.yellow}>]</span>
          <span>;&nbsp;</span>
          <span className={styles.green}>// the data you want to send to Bitsidy</span>
        </p>
        <br />
        <p>
          <span>$data = json_encode</span>
          <span className={styles.yellow}>(</span>
          <span>$data</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$iv &nbsp;&nbsp;= openssl_random_pseudo_bytes</span>
          <span className={styles.yellow}>(</span>
          <span className={styles.green}>16</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$data = $iv . utf8_encode</span>
          <span className={styles.yellow}>(</span>
          <span>$data</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$data = openssl_encrypt</span>
          <span className={styles.yellow}>(</span>
          <span>$data,&nbsp;</span>
          <span className={styles.orange}>'aes-256-cbc'</span>
          <span>,</span>
        </p>
        <br />
        <p>
          <span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
          </span>
          <span>$apiKey, &nbsp;</span>
          <span className={styles.green}>0</span>
          <span>, $iv</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$data = urlencode</span>
          <span className={styles.yellow}>(</span>
          <span>$data</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$requestData =&nbsp;</span>
          <span className={styles.yellow}>[</span>
        </p>
        <br />
        <p>
          <span>&nbsp;&nbsp;</span>
          <span className={styles.orange}>'storeId'&nbsp;</span>
          <span>{'=> $storeId,'}</span>
        </p>
        <br />
        <p>
          <span>&nbsp;&nbsp;</span>
          <span className={styles.orange}>'data'&nbsp;</span>
          <span>{'=> $data,'}</span>
        </p>
        <br />
        <p>
          <span className={styles.yellow}>]</span>
          <span>;</span>
        </p>
      </div>
    </div>
  );
};

const EncryptionSnipptet = ({ lang }: { lang: string }) => {
  const styles = SnippetsStyles();
  let component = <></>;
  switch (lang) {
    case 'phpraw':
      component = GetPhpRawSnippet();
  }

  return <div className={styles.snippetContainer}>{component}</div>;
};

export default EncryptionSnipptet;
