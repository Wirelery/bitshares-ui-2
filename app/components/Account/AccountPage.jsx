import React from "react";
import AccountActions from "actions/AccountActions";
import AccountStore from "stores/AccountStore";
import SettingsStore from "stores/SettingsStore";
import WalletUnlockStore from "stores/WalletUnlockStore";
// import AccountLeftPanel from "./AccountLeftPanel";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import {connect} from "alt-react";
import accountUtils from "common/account_utils";
import {List} from "immutable";
import Page404 from "../Page404/Page404";
import {Route, Switch, Redirect} from "react-router-dom";

/* Nested routes */
import AccountAssets from "./AccountAssets";
import {AccountAssetCreate} from "./AccountAssetCreate";
import AccountAssetUpdate from "./AccountAssetUpdate";
import AccountMembership from "./AccountMembership";
import AccountVesting from "./AccountVesting";
import AccountPermissions from "./AccountPermissions";
import AccountSignedMessages from "./AccountSignedMessages";
import AccountWhitelist from "./AccountWhitelist";
import AccountVoting from "./AccountVoting";
import AccountOverview from "./AccountOverview";

class AccountPage extends React.Component {
    static propTypes = {
        account: ChainTypes.ChainAccount.isRequired
    };

    componentDidMount() {
        if (this.props.account) {
            AccountActions.setCurrentAccount.defer(
                this.props.account.get("name")
            );

            // Fetch possible fee assets here to avoid async issues later (will resolve assets)
            accountUtils.getPossibleFees(this.props.account, "transfer");
        }
    }

    componentWillReceiveProps(np) {
        if (np.account) {
            const npName = np.account.get("name");
            const currentName =
                this.props.account && this.props.account.get("name");

            if (!this.props.account || npName !== currentName) {
                // Update the current account in order to access the header right menu options
                AccountActions.setCurrentAccount.defer(npName);
                // Fetch possible fee assets here to avoid async issues later (will resolve assets)
                accountUtils.getPossibleFees(np.account, "transfer");
            }
        }
    }

    render() {
        let {
            myActiveAccounts,
            searchAccounts,
            settings,
            wallet_locked,
            account,
            hiddenAssets
        } = this.props;

        if (!account) {
            return <Page404 />;
        }
        let account_name = this.props.account.get("name");
        let isMyAccount = AccountStore.isMyAccount(account);

        let passOnProps = {
            account_name,
            myActiveAccounts,
            searchAccounts,
            settings,
            wallet_locked,
            account,
            isMyAccount,
            hiddenAssets,
            contained: true,
            balances: account.get("balances", List()).toList(),
            orders: account.get("orders", List()).toList(),
            viewSettings: this.props.viewSettings,
            proxy: account.getIn(["options", "voting_account"]),
            history: this.props.history
        };

        return (
            <div className="grid-block page-layout">
                <div className="grid-block no-padding">
                    <Switch>
                        <Route
                            path={`/exchange/account/${account_name}`}
                            exact
                            render={() => <AccountOverview {...passOnProps} />}
                        />
                        <Redirect
                            from={`/exchange/account/${account_name}/overview`}
                            to={`/exchange/account/${account_name}`}
                        />
                        <Route
                            path={`/exchange/account/${account_name}/assets`}
                            exact
                            render={() => <AccountAssets {...passOnProps} />}
                        />
                        <Route
                            path={`/exchange/account/${account_name}/create-asset`}
                            exact
                            render={() => (
                                <AccountAssetCreate {...passOnProps} />
                            )}
                        />
                        <Route
                            path={`/exchange/account/${account_name}/update-asset/:asset`}
                            exact
                            render={() => (
                                <AccountAssetUpdate {...passOnProps} />
                            )}
                        />
                        <Route
                            path={`/exchange/account/${account_name}/member-stats`}
                            exact
                            render={() => (
                                <AccountMembership {...passOnProps} />
                            )}
                        />
                        <Route
                            path={`/exchange/account/${account_name}/vesting`}
                            exact
                            render={() => <AccountVesting {...passOnProps} />}
                        />
                        <Route
                            path={`/exchange/account/${account_name}/permissions`}
                            exact
                            render={() => (
                                <AccountPermissions {...passOnProps} />
                            )}
                        />
                        <Route
                            path={`/exchange/account/${account_name}/voting`}
                            exact
                            render={() => <AccountVoting {...passOnProps} />}
                        />
                        <Route
                            path={`/exchange/account/${account_name}/whitelist`}
                            exact
                            render={() => <AccountWhitelist {...passOnProps} />}
                        />
                        <Route
                            path={`/exchange/account/${account_name}/signedmessages`}
                            exact
                            render={() => (
                                <AccountSignedMessages {...passOnProps} />
                            )}
                        />
                    </Switch>
                    {/* {React.cloneElement(
                        React.Children.only(this.props.children),
                        {
                            account_name,
                            myActiveAccounts,
                            searchAccounts,
                            settings,
                            wallet_locked,
                            account,
                            isMyAccount,
                            hiddenAssets,
                            contained: true,
                            balances: account.get("balances", List()).toList(),
                            orders: account.get("orders", List()).toList(),
                            backedCoins: this.props.backedCoins,
                            bridgeCoins: this.props.bridgeCoins,
                            gatewayDown: this.props.gatewayDown,
                            viewSettings: this.props.viewSettings,
                            proxy: account.getIn(["options", "voting_account"])
                        }
                    )} */}
                </div>
            </div>
        );
    }
}
AccountPage = BindToChainState(AccountPage, {
    show_loader: true
});

class AccountPageStoreWrapper extends React.Component {
    render() {
        let account_name = this.props.match.params.account_name;
        return <AccountPage {...this.props} account={account_name} />;
    }
}

export default connect(
    AccountPageStoreWrapper,
    {
        listenTo() {
            return [AccountStore, SettingsStore, WalletUnlockStore];
        },
        getProps() {
            return {
                myActiveAccounts: AccountStore.getState().myActiveAccounts,
                searchAccounts: AccountStore.getState().searchAccounts,
                settings: SettingsStore.getState().settings,
                hiddenAssets: SettingsStore.getState().hiddenAssets,
                wallet_locked: WalletUnlockStore.getState().locked,
                viewSettings: SettingsStore.getState().viewSettings
            };
        }
    }
);
