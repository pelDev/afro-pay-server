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
        logger.info(response.data.accounts[0])
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
            'FSPIOP-Source': MOJALOOP.PAYERFSP,
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
                partyIdType: MOJALOOP.IDTYPE,
                partyIdentifier: id,
                fspId: MOJALOOP.PAYEEFSP,
              },
            },
          },
          {
            headers: {
              Accept: 'application/vnd.interoperability.parties+json;version=1.1',
              'Content-Type': 'application/vnd.interoperability.parties+json;version=1.1',
              Date: new Date().toUTCString(),
              'FSPIOP-Source': MOJALOOP.PAYERFSP,
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

export const createMojaloopQuote = async({ id, amount, currency, note, senderFirstName, senderLastName, dateOfBirth }: Partial<mojaloopType>) => {
    try {
      logger.info(`Sending request: [POST] ${MOJALOOP.CREATEQUOTEENDPOINT}...`);

      const payeeFspFee = 0.2;
      const payerFspFee = 0.3;
      const amountToPay = Number(amount!) + 0.5;
  
      const response = await axios.post(
        MOJALOOP.CREATEQUOTEENDPOINT,
        {
          quoteId: '21bdc195-490b-4fe1-8fe9-923d89290294',
          transactionId: 'cfa20638-2fa6-4dc6-b16d-4b107d54e41b',
          payer: {
            partyIdInfo: {
              partyIdType: MOJALOOP.IDTYPE,
              partyIdentifier: '9090905555',
              fspId: MOJALOOP.PAYERFSP,
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
              partyIdType: MOJALOOP.IDTYPE,
              partyIdentifier: id,
              fspId: MOJALOOP.PAYEEFSP,
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
            'FSPIOP-Source': MOJALOOP.PAYERFSP,
            'FSPIOP-Destination': MOJALOOP.PAYEEFSP,
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
              amount: amountToPay.toString(),
            },
            expiration: new Date(new Date().getTime() - 3 * 60000).toISOString(),
            ilpPacket: MOJALOOP.ILPPACKET,
            condition: MOJALOOP.TRANSFERCONDITION,
            payeeFspFee: {
              currency: currency,
              amount: String(payeeFspFee),
            },
            geoCode: {
              latitude: '7.16322',
              longitude: '-45',
            },
            payeeFspCommission: {
              currency: currency,
              amount: String(payerFspFee),
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
              'FSPIOP-Source': MOJALOOP.PAYERFSP,
              'FSPIOP-Destination': MOJALOOP.PAYEEFSP,
              traceparent: '00-aabb40ecaa9eef97cdc2fe5588a4f12f-0123456789abcdef0-00',
            },
          }
        );
        
        if (confirmationResponse.status === 200) {
            logger.info('Payment quote created successfully');
            return +amountToPay
        }
      } else {
        return false
      }
    } catch (error: any) {
      logger.error(`Error during quote initiation: ${JSON.stringify(error.response.data)}`,);
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
          payerFsp: MOJALOOP.PAYERFSP,
          payeeFsp: MOJALOOP.PAYEEFSP,
          amount: {
            amount: String(amountToPay),
            currency: currency,
          },
          expiration: new Date(new Date().getTime() - 3 * 60000).toISOString(),
          ilpPacket: MOJALOOP.ILPPACKET,
          condition: MOJALOOP.TRANSFERCONDITION,
        },
        {
          headers: {
            Accept: 'application/vnd.interoperability.transfers+json;version=1.0',
            'Content-Type': 'application/vnd.interoperability.transfers+json;version=1.1',
            Date: new Date().toUTCString(),
            'FSPIOP-Source': MOJALOOP.PAYERFSP,
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
              'FSPIOP-Source': MOJALOOP.PAYERFSP,
              'FSPIOP-Destination': MOJALOOP.PAYEEFSP,
              traceparent: '00-aabb40ecaa9eef97cdc2fe5588a4f12f-0123456789abcdef0-00',
            },
          }
        );
  
        if (confirmationResponse.status === 200) {
            logger.info(`Payment successful: [${String(amountToPay) +' '+ currency}] sent to Merchant DFSP. `);
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