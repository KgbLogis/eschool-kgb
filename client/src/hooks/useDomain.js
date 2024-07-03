import defaultLogo from 'assets/logo/default.png'

const defaultData ={
    hostname: 'localhost',
    logo: defaultLogo
}

export default function useDomain() {

    return { domainData: defaultData }
    
}