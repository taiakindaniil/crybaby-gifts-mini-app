import type { FC } from "react";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia } from "../ui/item";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useHasActiveSubscription } from "@/hooks/useSubscription";
import { proxyImageUrl } from "@/lib/giftUrls";
import { ProxiedImage } from "@/components/ui/ProxiedImage"
import { useTranslation } from '@/i18n'

export const SubscriptionItem: FC = () => {
    const { t } = useTranslation()
    const hasActiveSubscription = useHasActiveSubscription();

    // Скрываем компонент, если у пользователя уже есть активная подписка
    if (hasActiveSubscription) {
        return null;
    }

    return (
      <div className="mx-4 mt-8">
        <ItemGroup className="bg-gradient-to-r from-orange-600 to-amber-400 rounded-xl border-none">
          <Item size="default" asChild>
            <Link to="/subscription" className="flex relative cursor-pointer">
              <ItemContent>
                <ItemDescription className="text-md font-bold text-blue-50">
                  {t('subscription.getAccess')}
                </ItemDescription>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-white/70" />
                  <span className="text-xs font-medium text-white/70">{t('subscription.learnMore')}</span>
                </div>
              </ItemContent>
              <div className="w-1/4">
                <ItemMedia variant="image" className="absolute bottom-0 right-0 p-2 bg-transparent border-none w-28 h-28">
                  <ProxiedImage src={proxyImageUrl("https://cdn.changes.tg/gifts/models/Mighty%20Arm/png/Original.png")} alt="Premium" />
                </ItemMedia>
              </div>
            </Link>
          </Item>
        </ItemGroup>
      </div>  
    )
}