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
    "Paypal developer ClientID";
  const clientSecret =
    "Paypal developer ClientSecret";
  return new payPalSdk.core.SandboxEnvironment(clientId, clientSecret);
};

export default client;
