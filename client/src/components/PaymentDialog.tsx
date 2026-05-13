import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string | null;
  amount?: number | null;
  defaultPhone?: string;
  onPaid?: () => void;
}

type Provider = "mtn" | "airtel";
type PaymentStatus = "initiated" | "pending" | "successful" | "failed" | "cancelled";

const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 90_000;

export default function PaymentDialog({ open, onOpenChange, bookingId, amount, defaultPhone, onPaid }: PaymentDialogProps) {
  const [provider, setProvider] = useState<Provider>("mtn");
  const [phone, setPhone] = useState(defaultPhone || "");
  const [submitting, setSubmitting] = useState(false);
  const [polling, setPolling] = useState(false);
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [txRef, setTxRef] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setProvider("mtn");
      setPhone(defaultPhone || "");
      setSubmitting(false);
      setPolling(false);
      setStatus(null);
      setTxRef(null);
    }
  }, [open, defaultPhone]);

  const pollForStatus = async (reference: string) => {
    setPolling(true);
    const started = Date.now();
    while (Date.now() - started < POLL_TIMEOUT_MS) {
      try {
        const res = await api.get(`/payments/${reference}/status`);
        const s: PaymentStatus = res.data?.payment?.status;
        setStatus(s);
        if (s === "successful") {
          toast({ title: "Payment successful", description: "Your booking is confirmed." });
          setPolling(false);
          // Hold the success state on-screen for a beat so the user sees it
          // before the parent closes the dialog.
          setTimeout(() => onPaid?.(), 1500);
          return;
        }
        if (s === "failed" || s === "cancelled") {
          toast({ title: "Payment failed", description: res.data?.payment?.statusReason || "Please try again.", variant: "destructive" });
          setPolling(false);
          return;
        }
      } catch (err: any) {
        // Soft-fail polling — webhook may still arrive
        console.warn("status poll error", err?.message);
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
    setPolling(false);
    toast({ title: "Still waiting", description: "We're still confirming your payment. You'll get an email once it completes." });
  };

  const handlePay = async () => {
    if (!bookingId) return;
    if (!phone) {
      toast({ title: "Phone number required", description: "Enter the mobile money number to bill.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await api.post("/payments/initiate", { bookingId, provider, phoneNumber: phone });
      const reference = res.data?.payment?.transactionReference;
      const initialStatus = res.data?.payment?.status;
      setTxRef(reference || null);
      setStatus(initialStatus || "pending");
      toast({ title: "Request sent", description: "Approve the prompt on your phone to complete payment." });
      if (reference && initialStatus !== "successful" && initialStatus !== "failed") {
        await pollForStatus(reference);
      } else if (initialStatus === "successful") {
        onPaid?.();
      }
    } catch (err: any) {
      toast({
        title: "Payment failed to start",
        description: err?.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay with Mobile Money</DialogTitle>
          <DialogDescription>
            {amount ? `Amount: UGX ${Number(amount).toLocaleString()}.` : ""} Choose your provider, enter your number, then approve the prompt on your phone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={provider === "mtn" ? "default" : "outline"}
              onClick={() => setProvider("mtn")}
              disabled={submitting || polling}
            >
              MTN MoMo
            </Button>
            <Button
              type="button"
              variant={provider === "airtel" ? "default" : "outline"}
              onClick={() => setProvider("airtel")}
              disabled={submitting || polling}
            >
              Airtel Money
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="momo-phone">Mobile money number</Label>
            <Input
              id="momo-phone"
              placeholder="+256 7XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting || polling}
            />
          </div>

          {status && (
            <div className="rounded-md border p-3 text-sm">
              <div>Status: <strong>{status}</strong></div>
              {txRef && <div className="text-muted-foreground text-xs mt-1">Ref: {txRef}</div>}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting || polling}>
            Close
          </Button>
          <Button onClick={handlePay} disabled={submitting || polling || !bookingId}>
            {(submitting || polling) ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {polling ? "Waiting for confirmation…" : "Sending request…"}
              </>
            ) : (
              "Pay now"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
