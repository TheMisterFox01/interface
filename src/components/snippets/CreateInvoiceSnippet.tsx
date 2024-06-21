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
        24 <br />
        25 <br />
        26 <br />
        27 <br />
        28 <br />
        29 <br />
        30 <br />
        31 <br />
        32 <br />
        33 <br />
        34 <br />
        35 <br />
        36 <br />
        37 <br />
        38 <br />
        39 <br />
        40 <br />
        41 <br />
        42 <br />
        43 <br />
        44 <br />
      </div>{' '}
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
        <p>
          <span>$data =&nbsp;</span>
          <span className={styles.yellow}>[</span>
        </p>
        <br />
        <p>
          <span>&nbsp;&nbsp;</span>
          <span className={styles.orange}>'currency'</span>
          <span>:&nbsp;</span>
          <span className={styles.orange}>'BTC'</span>
          <span>,</span>
        </p>
        <br />
        <p>
          <span>&nbsp;&nbsp;</span>
          <span className={styles.orange}>'amount'</span>
          <span>:&nbsp;</span>
          <span className={styles.orange}>'100'</span>
          <span>,&nbsp;</span>
          <span className={styles.green}>// in USD</span>
        </p>
        <br />
        <p>
          <span>&nbsp;&nbsp;</span>
          <span className={styles.orange}>'orderId'</span>
          <span>:&nbsp;</span>
          <span className={styles.green}>1</span>
          <span>,&nbsp;</span>
          <span className={styles.green}>// your local invoice ID</span>
        </p>
        <br />
        <p>
          <span>&nbsp;&nbsp;</span>
          <span className={styles.orange}>'email'</span>
          <span>:&nbsp;</span>
          <span className={styles.orange}>'example@email.com'</span>
          <span>,</span>
        </p>
        <br />
        <p>
          <span>&nbsp;&nbsp;</span>
          <span className={styles.orange}>'callbackNotify'</span>
          <span>:&nbsp;</span>
          <span className={styles.orange}>'https://your.site/callback.php?someInfo=here'</span>
          <span>,</span>
        </p>
        <br />
        <p>
          <span>&nbsp;&nbsp;</span>
          <span className={styles.orange}>'customString'</span>
          <span>:&nbsp;</span>
          <span className={styles.orange}>'Payment for some kind of product'</span>
        </p>
        <br />
        <p>
          <span className={styles.yellow}>]</span>
          <span>;</span>
        </p>
        <br />
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
          <span>, $apiKey, &nbsp;</span>
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
          <span className={styles.yellow}>{'['}</span>
        </p>
        <br />
        <p>
          <span>&nbsp;&nbsp;</span>
          <span className={styles.orange}>'storeId'</span>
          <span>&nbsp;{'=>'}&nbsp;</span>
          <span>$storeId,</span>
        </p>
        <br />
        <p>
          <span>&nbsp;&nbsp;</span>
          <span className={styles.orange}>'data'</span>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;{'=>'}&nbsp;</span>
          <span>$data</span>
        </p>
        <br />
        <p>
          <span className={styles.yellow}>{']'}</span>
          <span>;</span>
        </p>
        <br />
        <br />
        <p>
          <span>$ch = curl_init</span>
          <span className={styles.yellow}>()</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>curl_setopt</span>
          <span className={styles.yellow}>(</span>
          <span>
            $ch, CURLOPT_URL, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span className={styles.orange}>‘https://api.bitsidy.com/v1/app/invoice/create’</span>
          <span>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>curl_setopt</span>
          <span className={styles.yellow}>(</span>
          <span>$ch, CURLOPT_RETURNTRANSFER,&nbsp;</span>
          <span className={styles.green}>1</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>curl_setopt</span>
          <span className={styles.yellow}>(</span>
          <span>
            $ch, CURLOPT_POST, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span className={styles.green}>1</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>curl_setopt</span>
          <span className={styles.yellow}>(</span>
          <span>$ch, CURLOPT_POSTFIELDS, &nbsp;&nbsp;&nbsp;&nbsp;$requestData</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>curl_setopt</span>
          <span className={styles.yellow}>(</span>
          <span>$ch, CURLOPT_HTTPHEADER, &nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className={styles.purple}>[</span>
          <span>‘Content-Type: application/json’</span>
          <span className={styles.purple}>]</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <br />
        <p>
          <span>$response = curl_exec</span>
          <span className={styles.yellow}>(</span>
          <span>$ch</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <br />
        <p>
          <span>$response = json_decode</span>
          <span className={styles.yellow}>(</span>
          <span>$response,&nbsp;</span>
          <span className={styles.blue}>true</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$response = $response</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'data'</span>
          <span className={styles.yellow}>]</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$response = urldecode</span>
          <span className={styles.yellow}>(</span>
          <span>$response</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$response = base64_decode</span>
          <span className={styles.yellow}>(</span>
          <span>$response</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$iv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = substr</span>
          <span className={styles.yellow}>(</span>
          <span>$response,&nbsp;</span>
          <span className={styles.green}>0</span>
          <span>,&nbsp;</span>
          <span className={styles.green}>16</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$response = substr</span>
          <span className={styles.yellow}>(</span>
          <span>$response,&nbsp;</span>
          <span className={styles.green}>16</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$response = openssl_decrypt</span>
          <span className={styles.yellow}>(</span>
          <span>$response,&nbsp;</span>
          <span className={styles.orange}>'aes-256-cbc'</span>
          <span>, $apiKey, OPENSSL_RAW_DATA, $iv</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <p>
          <span>$response = json_decode</span>
          <span className={styles.yellow}>(</span>
          <span>$response,&nbsp;</span>
          <span className={styles.blue}>true</span>
          <span className={styles.yellow}>)</span>
          <span>;</span>
        </p>
        <br />
        <br />
        <p>
          <span>$response</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'transactionId'</span>
          <span className={styles.yellow}>]</span>
          <span>;&nbsp;</span>
          <span className={styles.green}>// Bitsidy transaction ID</span>
        </p>
        <br />
        <p>
          <span>$response</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'paymentLink'</span>
          <span className={styles.yellow}>]</span>
          <span>;&nbsp;</span>
          <span className={styles.green}>// https://bitsidy.com/invoice/...</span>
        </p>
        <br />
        <p>
          <span>$response</span>
          <span className={styles.yellow}>[</span>
          <span className={styles.orange}>'amount'</span>
          <span className={styles.yellow}>]</span>
          <span>;&nbsp;</span>
          <span className={styles.green}>// 0.000123 in BTC</span>
        </p>
      </div>
    </div>
  );
};

const CreateInvoiceSnippet = ({ lang }: { lang: string }) => {
  const styles = SnippetsStyles();
  let component = <></>;
  switch (lang) {
    case 'phpraw':
      component = GetPhpRawSnippet();
  }

  return <div className={styles.snippetContainer}>{component}</div>;
};

export default CreateInvoiceSnippet;
