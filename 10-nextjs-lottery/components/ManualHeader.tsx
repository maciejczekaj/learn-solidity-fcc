import React, { useCallback, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

export const ManualHeader: React.FC = () => {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();

    const handleConnectClick = useCallback(async () => {
        await enableWeb3();
        window.localStorage.setItem('connected', 'injected');
    }, []);

    useEffect(() => {
        if (isWeb3Enabled) {
            return;
        }

        if (typeof window !== 'undefined' && window.localStorage.getItem('connected') === 'injected') {
            enableWeb3();
        }
    }, [isWeb3Enabled]);

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`);
            if (!account) {
                window.localStorage.removeItem('connected');
                deactivateWeb3();
                console.log('Null account found');
            }
        });
    }, []);

    return (
        <div>
            {account ? (
                <div>
                    Connected as {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button disabled={isWeb3EnableLoading} onClick={handleConnectClick}>Connect</button>
            )}
        </div>
    );
};