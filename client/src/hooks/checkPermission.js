import { useQuery } from '@apollo/client';
import { MY_PERMISSION } from 'graphql/role'

export function CheckPer(codename) {

	const { loading, data } = useQuery(MY_PERMISSION, {
	})

    if (loading) return 'loading'

	return data.userPermissions.some(function(el) {
		return el.codename === codename;
	}); 
}

