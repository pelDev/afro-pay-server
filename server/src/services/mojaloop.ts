import axios from "axios";

import logger from "./logger";
import * as MOJALOOP from "../utils/constants";

export interface mojaloopType {
    id: string,
    name: string,
    currency: "USD" | "TZS",
    amount: number,
    amountToPay: number,
    note: string,
    senderFirstName: string,
    senderLastName: string,
    dateOfBirth: string
}

export const registerMojaloopParticipant = async ( { name, currency }: Partial<mojaloopType>) => {
    try {
      const requestData = { name, currency }
  
      logger.info(`Sending request to ${MOJALOOP.NEWPARTICIPANTENDPOINT}: ${requestData}`);
  
      const response = await axios.post(MOJALOOP.NEWPARTICIPANTENDPOINT, requestData);
  
      if (response.status === 201) {
        logger.info(`Participant created successfully, ID: ${response.data.accounts[0].id}`,);
        return response.data.accounts[0].id;
      }

      return false;
    } catch (error) {
      logger.error('Internal Server Error:', (error as any).response.data);
      return false;
    }
};

export const getMojaloopParties = async ({ id }: Partial<mojaloopType>) => {
    try {
      logger.info(`Sending ALS request: [GET] ${MOJALOOP.GETPARTIESENDPOINT + id}...`);
  
      const response = await axios.get(
        MOJALOOP.GETPARTIESENDPOINT + id,
        {
          headers: {
            Accept: 'application/vnd.interoperability.parties+json;version=1.1',
            'Content-Type': 'application/vnd.interoperability.parties+json;version=1.1',
            Date: new Date().toUTCString(),
            'FSPIOP-Source': 'pinkbankfsp',
            traceparent: '00-aabb40ecaa9eef97cdc2fe5588a4f12f-0123456789abcdef0-00',
          },
        }
      );
  
      if (response.status === 202) {
        logger.info('Account lookup initiated, awaiting confirmation...');
        //Await the server processing for 1.5s before confirming 
        await new Promise(resolve => setTimeout(resolve, 1500));
        logger.info(`Sending confirmation request: [PUT] ${MOJALOOP.PUTPARTIESENDPOINT + id}...`);
  
        const confirmationResponse = await axios.put(
            MOJALOOP.PUTPARTIESENDPOINT + id,
          {
            party: {
              partyIdInfo: {
                partyIdType: 'MSISDN',
                partyIdentifier: id,
                fspId: 'greenbankfsp',
              },
            },
          },
          {
            headers: {
              Accept: 'application/vnd.interoperability.parties+json;version=1.1',
              'Content-Type': 'application/vnd.interoperability.parties+json;version=1.1',
              Date: new Date().toUTCString(),
              'FSPIOP-Source': 'pinkbankfsp',
              traceparent: '00-aabb40ecaa9eef97cdc2fe5588a4f12f-0123456789abcdef0-00',
            },
          }
        );
  
        logger.info(`Account lookup successful for ID: ${id}`);
        
        if (confirmationResponse.status === 200) {
          return true
        }
    }
        return false
    }catch (error) {
      logger.error(`Error during payment initiation: ${(error as any).response.data}`,);
      return false
    }
};

export const createMojaloopQuote = async({ id, amount, currency, note, senderFirstName, senderLastName, dateOfBirth }: mojaloopType) => {
    try {

      logger.info(`Sending request: [POST] ${MOJALOOP.CREATEQUOTEENDPOINT}...`);
  
      const response = await axios.post(
        MOJALOOP.CREATEQUOTEENDPOINT,
        {
          quoteId: '21bdc195-490b-4fe1-8fe9-923d89290294',
          transactionId: 'cfa20638-2fa6-4dc6-b16d-4b107d54e41b',
          payer: {
            partyIdInfo: {
              partyIdType: 'MSISDN',
              partyIdentifier: '9090905555',
              fspId: 'pinkbankfsp',
              extensionList: {
                extension: [
                  {
                    key: 'accountType',
                    value: 'Wallet',
                  },
                ],
              },
            },
            personalInfo: {
              complexName: {
                firstName: senderFirstName,
                lastName: senderLastName,
              },
              dateOfBirth: dateOfBirth,
            },
          },
          payee: {
            partyIdInfo: {
              partyIdType: 'MSISDN',
              partyIdentifier: id,
              fspId: 'greenbankfsp',
              extensionList: {
                extension: [
                  {
                    key: 'accountType',
                    value: 'Wallet',
                  },
                ],
              },
            },
          },
          amountType: 'RECEIVE',
          amount: {
            amount: String(amount),
            currency: currency,
          },
          transactionType: {
            scenario: 'TRANSFER',
            initiator: 'PAYER',
            initiatorType: 'CONSUMER',
          },
          note: note,
        },
        {
          headers: {
            Accept: 'application/vnd.interoperability.quotes+json;version=1.0',
            'Content-Type': 'application/vnd.interoperability.quotes+json;version=1.0',
            Date: new Date().toUTCString(),
            'FSPIOP-Source': 'pinkbankfsp',
            'FSPIOP-Destination': 'greenbankfsp',
            traceparent: '00-aabb40ecaa9eef97cdc2fe5588a4f12f-0123456789abcdef0-00',
          },
        }
      );
  
      if (response.status === 202) {
        logger.info('Create Quote initiated, awaiting confirmation...');
        //Await the server processing for 1.5s before confirming 
        await new Promise(resolve => setTimeout(resolve, 1500));
        logger.info(`Sending confirmation request: [PUT] ${MOJALOOP.PUTQUOTEENDPOINT}...`);
  
        const confirmationResponse = await axios.put(
            MOJALOOP.PUTQUOTEENDPOINT,
          {
            transferAmount: {
              currency: currency,
              amount: String(amount + 0.5),
            },
            expiration: new Date(new Date().getTime() - 3 * 60000).toISOString(),
            ilpPacket: 'AYIDwAAAAAAAACdCIGcuZ3JlZW5iYW5rZnNwLm1zaXNkbi45MDkwOTA1NTU1ggOTZXlKMGNtRnVjMkZqZEdsdmJrbGtJam9pWTJaaE1qQTJNemd0TW1aaE5pMDBaR00yTFdJeE5tUXROR0l4TURka05UUmxOREZpSWl3aWNYVnZkR1ZKWkNJNklqSXhZbVJqTVRrMUxUUTVNR0l0TkdabE1TMDRabVU1TFRreU0yUTRPVEk1TURJNU5DSXNJbkJoZVdWbElqcDdJbkJoY25SNVNXUkpibVp2SWpwN0luQmhjblI1U1dSVWVYQmxJam9pVFZOSlUwUk9JaXdpY0dGeWRIbEpaR1Z1ZEdsbWFXVnlJam9pT1RBNU1Ea3dOVFUxTlNJc0ltWnpjRWxrSWpvaVozSmxaVzVpWVc1clpuTndJaXdpWlhoMFpXNXphVzl1VEdsemRDSTZleUpsZUhSbGJuTnBiMjRpT2x0N0ltdGxlU0k2SW1GalkyOTFiblJVZVhCbElpd2lkbUZzZFdVaU9pSlhZV3hzWlhRaWZWMTlmWDBzSW5CaGVXVnlJanA3SW5CaGNuUjVTV1JKYm1adklqcDdJbkJoY25SNVNXUlVlWEJsSWpvaVRWTkpVMFJPSWl3aWNHRnlkSGxKWkdWdWRHbG1hV1Z5SWpvaU9UQTVNRGt3TlRVMU5TSXNJbVp6Y0Vsa0lqb2ljR2x1YTJKaGJtdG1jM0FpTENKbGVIUmxibk5wYjI1TWFYTjBJanA3SW1WNGRHVnVjMmx2YmlJNlczc2lhMlY1SWpvaVlXTmpiM1Z1ZEZSNWNHVWlMQ0oyWVd4MVpTSTZJbGRoYkd4bGRDSjlYWDE5TENKd1pYSnpiMjVoYkVsdVptOGlPbnNpWTI5dGNHeGxlRTVoYldVaU9uc2labWx5YzNST1lXMWxJam9pVTNWbGFTSXNJbXhoYzNST1lXMWxJam9pVW1Gd2FHRmxiQ0o5TENKa1lYUmxUMlpDYVhKMGFDSTZJakU1T0RRdE1ERXRNREVpZlgwc0ltRnRiM1Z1ZENJNmV5SmpkWEp5Wlc1amVTSTZJbFZUUkNJc0ltRnRiM1Z1ZENJNklqRXdNQzQxSW4wc0luUnlZVzV6WVdOMGFXOXVWSGx3WlNJNmV5SnpZMlZ1WVhKcGJ5STZJbFJTUVU1VFJrVlNJaXdpYVc1cGRHbGhkRzl5SWpvaVVFRlpSVklpTENKcGJtbDBhV0YwYjNKVWVYQmxJam9pUTA5T1UxVk5SVklpZlgwAA',
            condition: 'OrYQwM_ZhNCxa-tGfs2XuIUcyHIdkV3d560paRwk8G8',
            payeeFspFee: {
              currency: currency,
              amount: '0.2',
            },
            geoCode: {
              latitude: '7.16322',
              longitude: '-45',
            },
            payeeFspCommission: {
              currency: currency,
              amount: '0.3',
            },
            payeeReceiveAmount: {
              currency: currency,
              amount: String(amount),
            },
          },
          {
            headers: {
              Accept: 'application/vnd.interoperability.quotes+json;version=1.0',
              'Content-Type': 'application/vnd.interoperability.quotes+json;version=1.0',
              Date: new Date().toUTCString(),
              'FSPIOP-Source': 'pinkbankfsp',
              'FSPIOP-Destination': 'greenbankfsp',
              traceparent: '00-aabb40ecaa9eef97cdc2fe5588a4f12f-0123456789abcdef0-00',
            },
          }
        );
        
        if (confirmationResponse.status === 200) {
            logger.info('Payment quote created successfully');
            return true
        }
      } else {
            return false
      }
    } catch (error) {
      logger.error(`Error during quote initiation: ${(error as any).response.data}`,);
      return false
    }
};

export const transferMojaloop = async ({ amountToPay, currency }: Partial<mojaloopType>) => {
    try {  
      logger.info(`Sending request: [POST] ${MOJALOOP.CREATETRANSFERENDPOINT}...`);
  
      const response = await axios.post(
        MOJALOOP.CREATETRANSFERENDPOINT,
        {
          transferId: 'cfa20638-2fa6-4dc6-b16d-4b107d54e41b',
          payerFsp: 'pinkbankfsp',
          payeeFsp: 'greenbankfsp',
          amount: {
            amount: String(amountToPay),
            currency: currency,
          },
          expiration: new Date(new Date().getTime() - 3 * 60000).toISOString(),
          ilpPacket:
            'AYIDwAAAAAAAACdCIGcuZ3JlZW5iYW5rZnNwLm1zaXNkbi45MDkwOTA1NTU1ggOTZXlKMGNtRnVjMkZqZEdsdmJrbGtJam9pWTJaaE1qQTJNemd0TW1aaE5pMDBaR00yTFdJeE5tUXROR0l4TURka05UUmxOREZpSWl3aWNYVnZkR1ZKWkNJNklqSXhZbVJqTVRrMUxUUTVNR0l0TkdabE1TMDRabVU1TFRreU0yUTRPVEk1TURJNU5DSXNJbkJoZVdWbElqcDdJbkJoY25SNVNXUkpibVp2SWpwN0luQmhjblI1U1dSVWVYQmxJam9pVFZOSlUwUk9JaXdpY0dGeWRIbEpaR1Z1ZEdsbWFXVnlJam9pT1RBNU1Ea3dOVFUxTlNJc0ltWnpjRWxrSWpvaVozSmxaVzVpWVc1clpuTndJaXdpWlhoMFpXNXphVzl1VEdsemRDSTZleUpsZUhSbGJuTnBiMjRpT2x0N0ltdGxlU0k2SW1GalkyOTFiblJVZVhCbElpd2lkbUZzZFdVaU9pSlhZV3hzWlhRaWZWMTlmWDBzSW5CaGVXVnlJanA3SW5CaGNuUjVTV1JKYm1adklqcDdJbkJoY25SNVNXUlVlWEJsSWpvaVRWTkpVMFJPSWl3aWNHRnlkSGxKWkdWdWRHbG1hV1Z5SWpvaU9UQTVNRGt3TlRVMU5TSXNJbVp6Y0Vsa0lqb2ljR2x1YTJKaGJtdG1jM0FpTENKbGVIUmxibk5wYjI1TWFYTjBJanA3SW1WNGRHVnVjMmx2YmlJNlczc2lhMlY1SWpvaVlXTmpiM1Z1ZEZSNWNHVWlMQ0oyWVd4MVpTSTZJbGRoYkd4bGRDSjlYWDE5TENKd1pYSnpiMjVoYkVsdVptOGlPbnNpWTI5dGNHeGxlRTVoYldVaU9uc2labWx5YzNST1lXMWxJam9pVTNWbGFTSXNJbXhoYzNST1lXMWxJam9pVW1Gd2FHRmxiQ0o5TENKa1lYUmxUMlpDYVhKMGFDSTZJakU1T0RRdE1ERXRNREVpZlgwc0ltRnRiM1Z1ZENJNmV5SmpkWEp5Wlc1amVTSTZJbFZUUkNJc0ltRnRiM1Z1ZENJNklqRXdNQzQxSW4wc0luUnlZVzV6WVdOMGFXOXVWSGx3WlNJNmV5SnpZMlZ1WVhKcGJ5STZJbFJTUVU1VFJrVlNJaXdpYVc1cGRHbGhkRzl5SWpvaVVFRlpSVklpTENKcGJtbDBhV0YwYjNKVWVYQmxJam9pUTA5T1UxVk5SVklpZlgwAA',
          condition: 'OrYQwM_ZhNCxa-tGfs2XuIUcyHIdkV3d560paRwk8G8',
        },
        {
          headers: {
            Accept: 'application/vnd.interoperability.transfers+json;version=1.0',
            'Content-Type': 'application/vnd.interoperability.transfers+json;version=1.1',
            Date: new Date().toUTCString(),
            'FSPIOP-Source': 'pinkbankfsp',
            traceparent: '00-aabb40ecaa9eef97cdc2fe5588a4f12f-0123456789abcdef0-00',
          },
        }
      );
  
      if (response.status === 202) {
        logger.info('Transfer initiated, awaiting confirmation...');
        //Await the server processing for 1.5s before confirming 
        await new Promise(resolve => setTimeout(resolve, 1500));
        logger.info(`Sending confirmation request: [PUT] ${MOJALOOP.PUTTRANSFERENDPOINT}...`);
  
        const confirmationResponse = await axios.put(
            MOJALOOP.PUTTRANSFERENDPOINT,
          {
            transferState: 'COMMITTED',
            completedTimestamp: new Date(new Date().getTime() - 3 * 60000).toISOString(),
            fulfilment: 'QtcJELWfNw5P4cZnv7Y30d7mn6O0Qk-ay9WYod9YtG8',
          },
          {
            headers: {
              Accept: 'application/vnd.interoperability.transfers+json;version=1.0',
              'Content-Type': 'application/vnd.interoperability.transfers+json;version=1.0',
              Date: new Date().toUTCString(),
              'FSPIOP-Source': 'pinkbankfsp',
              'FSPIOP-Destination': 'greenbankfsp',
              traceparent: '00-aabb40ecaa9eef97cdc2fe5588a4f12f-0123456789abcdef0-00',
            },
          }
        );
  
        if (confirmationResponse.status === 200) {
            logger.info(`Payment successful: [${String(amountToPay) +' '+ currency}] sent to Merchant DFSP [greenbankdfsp].`);
            return true
        }
      } else {
        return false
      }
    } catch (error) {
      logger.error(`Error during payment initiation: ${(error as any).response.data}`,);
      return false
    }
};