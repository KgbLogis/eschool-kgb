import {
	SIGNIN,
} from '../constants/Auth';
import {
	showAuthMessage
} from "../actions/Auth";

export function* signInWithFBEmail() {
  yield takeEvery(SIGNIN, function* ({payload}) {
		try {
		} catch (err) {
			yield put(showAuthMessage(err));
		}
	});
}

export default function* rootSaga() {
  yield all([
		fork(signInWithFBEmail),
  ]);
}
