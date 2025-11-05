import React from "react";
import type { IAddress } from "@/commons/types/types";

import "./addressList.style.css";


interface AddressListProps {
  addresses: IAddress[] | [];
  onSelectAddress?: (address: IAddress) => void;
  selectedAddress?: IAddress | null;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onSelectAddress,
  selectedAddress,
}) => {
  if (!addresses || addresses.length === 0) {
    return (
      <div className="address-list-empty">
        <p>Nenhum endereço cadastrado.</p>
      </div>
    );
  }

  return (
    <div className="address-list">
      <h3>Endereços</h3>
      <ul className="address-items">
        {addresses.map((address, index) => (
          <li
            key={address.id || index}
            className={`address-item ${
              selectedAddress?.id === address.id ? "selected" : ""
            }`}
            onClick={() => onSelectAddress?.(address)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectAddress?.(address);
              }
            }}
            aria-label={`Selecionar endereço: ${address.street}, ${address.number}, ${address.neighborhood}, ${address.city}`}
          >
            {onSelectAddress && (
              <div className="address-radio-container">
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddress?.id === address.id}
                  onChange={() => onSelectAddress(address)}
                  className="address-radio"
                  aria-label={`Selecionar este endereço`}
                />
              </div>
            )}
            <div className="address-content">
              <div className="address-header">
                <strong>
                  {address.street}, {address.number}
                </strong>
                {address.complement && <span> - {address.complement}</span>}
              </div>
              <div className="address-details">
                {address.neighborhood}, {address.city} - {address.state}
              </div>
              <div className="address-postal">CEP: {address.cep}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
