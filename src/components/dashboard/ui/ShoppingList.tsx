import React, { useRef } from 'react';
import { Plus, ShoppingCart, Check, Sparkles } from 'lucide-react';
import { celebrate } from '../../../lib/animations';
import { gsap } from 'gsap';

interface ShoppingItemCardProps {
  name: string;
  quantity: number;
  requestedBy: string;
  onPurchase: () => void;
  isPurchased?: boolean;
  delay?: number;
}

export const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({
  name,
  quantity,
  requestedBy,
  onPurchase,
  isPurchased = false,
  delay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, delay, ease: 'power2.out' }
      );
    }
  }, [delay]);

  const handlePurchase = () => {
    if (checkRef.current) {
      celebrate(checkRef.current);
    }
    onPurchase();
  };

  return (
    <div
      ref={cardRef}
      className={`
        glass-card p-4 transition-all duration-300
        ${isPurchased
          ? 'opacity-40 bg-zinc-900/50'
          : 'hover:border-white/20 hover:bg-white/5'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${isPurchased ? 'line-through text-zinc-600' : 'text-white'}`}>
            {name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-zinc-500">x{quantity}</span>
            <span className="text-zinc-700">•</span>
            <span className="text-xs text-zinc-600">Requested by {requestedBy}</span>
          </div>
        </div>

        <button
          ref={checkRef}
          onClick={handlePurchase}
          disabled={isPurchased}
          className={`
            p-3 rounded-xl transition-all duration-200 flex-shrink-0
            ${isPurchased
              ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
              : 'bg-gradient-to-br from-violet-500/20 to-purple-600/20 text-violet-400 hover:from-violet-500 hover:to-purple-600 hover:text-white hover:scale-110 active:scale-95'
            }
          `}
        >
          {isPurchased ? (
            <Check className="w-5 h-5" />
          ) : (
            <ShoppingCart className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

interface ShoppingListProps {
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    requestedByName: string;
    status: 'pending' | 'purchased';
  }>;
  onAddItem: () => void;
  onPurchase: (id: string) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, onAddItem, onPurchase }) => {
  const pendingItems = items.filter(i => i.status === 'pending');
  const purchasedItems = items.filter(i => i.status === 'purchased').slice(0, 3);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Shopping List</h3>
            <p className="text-sm text-zinc-500">{pendingItems.length} items needed</p>
          </div>
        </div>

        <button
          onClick={onAddItem}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group"
        >
          <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Pending items */}
      <div className="space-y-3 mb-6">
        {pendingItems.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">All caught up!</p>
            <p className="text-sm text-zinc-600 mt-1">No items on the list</p>
          </div>
        ) : (
          pendingItems.map((item, idx) => (
            <ShoppingItemCard
              key={item.id}
              name={item.name}
              quantity={item.quantity}
              requestedBy={item.requestedByName}
              onPurchase={() => onPurchase(item.id)}
              isPurchased={item.status === 'purchased'}
              delay={idx * 0.05}
            />
          ))
        )}
      </div>

      {/* Recently purchased */}
      {purchasedItems.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-3">
            Recently Purchased
          </h4>
          <div className="space-y-2">
            {purchasedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-sm text-zinc-500 line-through flex-1">
                  {item.name}
                </span>
                <span className="text-xs text-zinc-600">x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface AddShoppingButtonProps {
  onClick: () => void;
  className?: string;
}

export const AddShoppingButton: React.FC<AddShoppingButtonProps> = ({ onClick, className = '' }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (buttonRef.current) {
      const tl = gsap.timeline();
      tl.to(buttonRef.current, { scale: 0.95, duration: 0.1 })
        .to(buttonRef.current, { scale: 1, duration: 0.15, ease: 'back.out(1.7)' });
    }
    onClick();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`
        px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600
        text-white font-semibold flex items-center gap-2
        hover:shadow-lg hover:shadow-violet-500/25
        active:scale-95 transition-all duration-200
        ${className}
      `}
    >
      <Plus className="w-4 h-4" />
      Add Item
    </button>
  );
};
