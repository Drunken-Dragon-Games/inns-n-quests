import { Provider, useSelector } from "react-redux"
import { AccountState, accountStore } from "../../account/account-state"
import { CollectionView } from "../../account"

const CollectionContent = (): JSX.Element => {
    const accountState = useSelector((state: AccountState) => state)
    return (
        <>{
            accountState.userInfo ?
            <CollectionView userInfo={accountState.userInfo} /> :
            <></>
        }
        </>
    )
}

const CollectionComponent = () => 
    <Provider store={accountStore}>
        <CollectionContent />
    </Provider>

export default CollectionComponent

