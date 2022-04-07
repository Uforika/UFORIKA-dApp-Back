import { Injectable } from '@nestjs/common';
import { CHAIN_ID } from 'config';
import { recoverTypedSignature_v4 as recoverSignature } from 'eth-sig-util';
import { toChecksumAddress } from 'ethereumjs-util';

@Injectable()
export class Web3Service {
  public verifySignature(address: string, signature: string): boolean {
    const recovered = recoverSignature({
      data: JSON.parse(this.signMessage),
      sig: signature,
    });
    return this.getCheckSummedAddress(recovered) === this.getCheckSummedAddress(address);
  }

  public getCheckSummedAddress(address: string): string {
    return toChecksumAddress(address);
  }

  public get signMessage(): string {
    return JSON.stringify({
      domain: {
        chainId: CHAIN_ID,
        name: 'Uforika',
        version: '1',
      },
      message: {
        contents: 'Uforika DApp Authorization',
      },
      primaryType: 'SignMessage',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
        ],
        SignMessage: [{ name: 'contents', type: 'string' }],
      },
    });
  }
}
