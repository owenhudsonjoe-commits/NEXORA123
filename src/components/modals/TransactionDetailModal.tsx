import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Calendar,
  Clock,
  Tag,
  FileText,
  ShieldCheck,
  Download,
  Share2,
  Copy,
  CreditCard,
  Building2,
} from 'lucide-react';
import { Transaction } from '../../types';
import { useBanking } from '../../context/BankingContext';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  const { formatMoney, userProfile } = useBanking();

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';
  const isExchange = transaction.type === 'exchange';

  const copyRef = () => {
    navigator.clipboard?.writeText(transaction.referenceId);
    alert('Reference ID copied to clipboard!');
  };

  const handleDownloadDemoReceipt = () => {
    const text = `
NEXORA OFFICIAL TRANSACTION RECEIPT
Ref: ${transaction.referenceId}
Merchant/Counterparty: ${transaction.recipientMerchant}
Amount: ${formatMoney(transaction.amount, transaction.currency)}
Status: ${transaction.status.toUpperCase()}
Date: ${new Date(transaction.timestamp).toLocaleString()}
Category: ${transaction.category}
Authorized & Verified By NEXORA Digital Banking
`;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `NEXORA_RECEIPT_${transaction.referenceId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 text-black max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <h3 className="font-bold text-black text-base">Transaction Details</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center py-5 border-b border-zinc-100">
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-sm bg-zinc-100 border border-zinc-200 text-black"
            >
              {isIncome ? (
                <ArrowDownLeft className="w-7 h-7" />
              ) : isExchange ? (
                <Repeat className="w-7 h-7" />
              ) : (
                <ArrowUpRight className="w-7 h-7" />
              )}
            </div>
            <div className="text-2xl font-bold font-mono text-black">
              {isIncome ? '+' : isExchange ? '💱 ' : '-'}
              {formatMoney(transaction.amount, transaction.currency)}
            </div>
            <div className="text-sm font-semibold text-black mt-1">
              {transaction.recipientMerchant}
            </div>
            <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-100 border border-zinc-200 text-black">
              {transaction.status}
            </div>
          </div>

          {/* Details list */}
          <div className="py-4 space-y-3 text-xs">
            <div className="flex justify-between items-center text-zinc-700">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-400" /> Reference ID
              </span>
              <button
                onClick={copyRef}
                className="font-mono text-black flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                {transaction.referenceId}
                <Copy className="w-3 h-3 text-zinc-500" />
              </button>
            </div>

            <div className="flex justify-between items-center text-zinc-700">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Date & Time
              </span>
              <span className="text-black font-medium">{new Date(transaction.timestamp).toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-zinc-700">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-zinc-400" /> Category
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-black font-medium">
                {transaction.category}
              </span>
            </div>

            {transaction.isCardTransaction && (
              <div className="flex justify-between items-center text-zinc-700">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-zinc-400" /> Card Used
                </span>
                <span className="font-mono text-black font-medium">•••• {transaction.cardLast4} (Virtual)</span>
              </div>
            )}

            {transaction.counterpartyAccount && (
              <div className="flex justify-between items-center text-zinc-700">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" /> Counterparty
                </span>
                <span className="font-mono text-black font-medium">{transaction.counterpartyAccount}</span>
              </div>
            )}

            {transaction.exchangeDetails && (
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="text-[11px] text-black font-bold uppercase tracking-wider">
                  FX Conversion Detail
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Sold:</span>
                  <span className="font-mono text-black">
                    {formatMoney(
                      transaction.exchangeDetails.fromAmount,
                      transaction.exchangeDetails.fromCurrency
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Received:</span>
                  <span className="font-mono font-bold text-black">
                    {formatMoney(
                      transaction.exchangeDetails.toAmount,
                      transaction.exchangeDetails.toCurrency
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span>Rate:</span>
                  <span className="font-mono text-black">
                    1 {transaction.exchangeDetails.fromCurrency} ={' '}
                    {transaction.exchangeDetails.rate.toFixed(4)}{' '}
                    {transaction.exchangeDetails.toCurrency}
                  </span>
                </div>
              </div>
            )}

            {transaction.note && (
              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800">
                <span className="text-[10px] text-zinc-500 block mb-0.5">Note</span>
                "{transaction.note}"
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDownloadDemoReceipt}
              className="w-1/2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-200 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              Download Receipt
            </button>
            <button
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
