import payPalSdk from "@paypal/checkout-server-sdk";

/**
 * Returns PayPal HTTP client instance with environment which has access
 * credentials context. This can be used invoke PayPal API's provided the
 * credentials have the access to do so.
 */
const client = () => new payPalSdk.core.PayPalHttpClient(environment());

/**
 * Setting up and Returns PayPal SDK environment with PayPal Access credentials.
 * For demo purpose, we are using SandboxEnvironment. In production this will be
 * LiveEnvironment.
 */
const environment = () => {
  const clientId =
    "AV1x6EmVIuywrckX_H7LT9SRMBWhqLh5oW-G-56kkLMiOAFqTcFeVnuppNTZd1oJVqZSNQ3ufYpyObz9";
  const clientSecret =
    "ECGWxY93ZJmpDsRovLFImiStWPf1f0lZ_rst29BOkWsvBDYq8khlSpmKIB32wsQC5FNco73CcSNHB3Da";
  return new payPalSdk.core.SandboxEnvironment(clientId, clientSecret);
};

export default client;
