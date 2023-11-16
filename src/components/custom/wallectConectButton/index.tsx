import { useWeb3Modal } from "@web3modal/wagmi/react"
import Button from "@/components/ui/button"
import { useAccount, useDisconnect, useEnsName } from "wagmi"

type WalletConnectButtonProps = {
  // openTheModal: () => void
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = (props) => {
  // 4. Use modal hook
  const { open } = useWeb3Modal()
  const { isConnected, address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { disconnect } = useDisconnect()

  const clickOpenWallet = () => {
    open()

    // props.openTheModal()
  }
  return (
    <div>
      {!isConnected ? (
        <Button height="3rem" onClick={clickOpenWallet}>
          Connect Your Wallet
        </Button>
      ) : (
        <div className="flex gap-4 flex-wrap">
          <h5 className="text-base font-medium truncate">
            Connected Account:{" "}
            <span className="text-base">{ensName ?? address}</span>
          </h5>
          <Button onClick={() => disconnect()}>Disconnect Wallet</Button>
        </div>
      )}
      {/* <Button onClick={() => open({ view: "Networks" })}>
        Open Network Modal
      </Button> */}
    </div>
  )
}
export default WalletConnectButton
