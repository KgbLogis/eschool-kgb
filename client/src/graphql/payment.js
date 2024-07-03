import { gql } from "@apollo/client";

export const CHECK_INVOICE_STATUS = gql`
    query checkInvoiceStatus ($id: Int!) {
        checkInvoiceStatus (id: $id)
    }
`;

export const INVOICE_BY_STUDENT = gql`
    query invoiceByStudent {
        invoiceByStudent {
            id
            title
            description
            amount
            qpayQrText
            qpayQrImage
            qpayShorturl
            status
            invoiceStockSet {
                name
                description
                logo
                link
            }
        }
    }
`;

export const CREATE_INVOICE = gql`
    mutation createInvoice {
        createInvoice {
            invoice {
                id
            }
        }
    }
`;
