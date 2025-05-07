"use client"

//* next/react
import React from "react";

//* packages
import { AnimatePresence, motion, useAnimate } from "motion/react";

//* stores
import { GameParticipantWithUser, useSchwimmenGameStore } from "@/store/schwimmenGameStore";
import { useSchwimmenMetaStore } from "@/store/schwimmenMetaStore";

//* lib
import { SCHWIMMEN_GAME_ICON_SIZE_MAP, SCHWIMMEN_PLAYER_FALLBACK_SIZE_MAP, SCHWIMMEN_PLAYER_IMG_SIZE_MAP, SCHWIMMEN_PLAYER_TEXT_SIZE_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

//* icons
import { ManSwimmingIcon } from "@/components/icons/man-swimming";
import { CrownIcon, HeartIcon, SkullIcon, UserIcon } from "lucide-react";

//* components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayerNameScroller } from "./player-name-scroller";
import { Badge } from "@/components/ui/badge";


export type PlayerProps = {
  player: GameParticipantWithUser
  lifes: number
  isSwimming: boolean
  isNotIdle: boolean
  isWinner: boolean
}
export const Player = (params: React.ComponentPropsWithRef<typeof motion.button> & PlayerProps) => {
  const { player, lifes, isSwimming, isNotIdle, isWinner, className, ref, ...rest } = params

  //* variables
  const playerName = player.user ? (player.user.displayUsername || player.user.name) : player.displayName
  const isDead = lifes < 1
  const lifesWithKey = Array.from({ length: isSwimming ? lifes - 1 : lifes }).map((_, idx) => ({ key: idx }))

  //* hooks here
  const { action, rounds, game } = useSchwimmenGameStore()
  const { meta } = useSchwimmenMetaStore()
  const [isChoosing, setIsChoosing] = React.useState<boolean>(false)

  //* useEffect to react to round and action changes
  React.useEffect(() => {
    setIsChoosing(false)
  }, [rounds])
  React.useEffect(() => {
    setIsChoosing(isNotIdle)
  }, [action])


  return (
    <motion.button
      className={cn(
        "z-10 relative player-card shadow-xs transition-opacity max-w-[calc(100vw-2rem)] text-start",
        isDead && "!opacity-50 cursor-not-allowed shadow-none",
        className
      )}
      ref={ref}
      {...rest}
    >
      {/* dealer badge */}
      <AnimatePresence>
        {(meta.showDealer && game.status === "ACTIVE") &&
          <DealerBadge
            player={player}

            initial={{ x: -15, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -15, opacity: 0 }}
            transition={{
              opacity: { delay: 0, duration: 0.2 },
              x: { delay: 0, duration: 0.2 },
            }}
          />
        }
      </AnimatePresence>

      <div className="relative p-0.5 rounded-lg cursor-pointer overflow-hidden">

        {/* actual player card - has 0.375rem (= 6px) border to smooth out corner for animated border */}
        <div className={cn(
          "z-20 flex justify-between bg-background rounded-[0.375rem] overflow-hidden relative p-2 max-w-full gap-2",
          // SCHWIMMEN_PLAYER_CARD_PADDING_SIZE_MAP[meta.uiSize[0]]
        )}>
          {/* player image and name */}
          <div className="flex flex-1 items-center gap-2 overflow-hidden" >
            <Avatar className={cn("transition-[width,height] [&_svg]:transition-[width,height] duration-200 [&_svg]:duration-200", SCHWIMMEN_PLAYER_IMG_SIZE_MAP[meta.uiSize[0]])}>
              <AvatarImage src={player.user && player.user.image || undefined}></AvatarImage>
              <AvatarFallback><UserIcon className={cn(SCHWIMMEN_PLAYER_FALLBACK_SIZE_MAP[meta.uiSize[0]])} /></AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 gap-1 overflow-hidden">


              <PlayerNameScroller
                className={SCHWIMMEN_PLAYER_TEXT_SIZE_MAP[meta.uiSize[0]]}
              >
                {playerName}
              </PlayerNameScroller>


              {/* <span className={cn("font-medium transition-[font-size]", SCHWIMMEN_PLAYER_TEXT_SIZE_MAP[meta.uiSize[0]])}>{playerName}</span> */}


            </div>
          </div>

          {/* lifes */}
          <div className="flex flex-row-reverse items-center gap-1" >

            {/* player is swimming */}
            <AnimatePresence>
              {(isSwimming && !isDead && !isWinner) && <SwimmingEffect />}
            </AnimatePresence>

            {/* player lifes or dead state */}
            <AnimatePresence>
              {isDead && !isWinner
                ? <PlayerIsDead
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 100 }}
                  exit={{ opacity: 0 }}
                  className={cn("transition-[width,height] [&_svg]:transition-[width,height] duration-200 [&_svg]:duration-200", SCHWIMMEN_GAME_ICON_SIZE_MAP[meta.uiSize[0]])}
                />
                : !isWinner && lifesWithKey.map(({ key }) => (
                  <PlayerHeart
                    key={key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 100 }}
                    exit={{ opacity: 0 }}
                    className={cn("transition-[width,height] [&_svg]:transition-[width,height] duration-200 [&_svg]:duration-200", SCHWIMMEN_GAME_ICON_SIZE_MAP[meta.uiSize[0]])}
                  />
                ))
              }
            </AnimatePresence>

            <AnimatePresence>
              {isWinner && <PlayerIsWinner
                initial={{ opacity: 0 }}
                animate={{ opacity: 100 }}
                exit={{ opacity: 0 }}
                className={cn("transition-[width,height] [&_svg]:transition-[width,height] duration-200 [&_svg]:duration-200", SCHWIMMEN_GAME_ICON_SIZE_MAP[meta.uiSize[0]])}
              />}
            </AnimatePresence>
          </div>
        </div>

        {/* div with slightly negative inset to act as a border for animations */}
        <motion.div
          transition={{ duration: 0.5, ease: "easeOut", }}

          //* blue background - rising water levels animation
          {...((isSwimming && !isDead) ? {
            animate: { y: [56, 0] },
          } : {
            animate: { y: [0] },
          })}

          //* non motion div props
          className={cn("player-border absolute inset-0 rounded-lg bg-border transition-colors",
            isChoosing && "bg-muted-foreground",
            (isSwimming && !isNotIdle) && "bg-swimming",
            isDead && "bg-border",
            isWinner && "bg-yellow-300"
          )}
        />

      </div>
    </motion.button>
  );
}


//* local components
const DealerBadge = ({ player, className, ...spanProps }: React.ComponentPropsWithoutRef<typeof motion.span> & Pick<PlayerProps, "player">) => {
  const {
    currentRoundNumber, prevRoundNumber,
    getCurrentDealer, getPrevDealer
  } = useSchwimmenGameStore()
  const [badgeRef, animateBadgeFn] = useAnimate()
  const [isMounted, setIsMounted] = React.useState<boolean>(false)

  const transitionDuration = 0.2

  //* badge animation on round number change
  React.useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
      return;
    }

    const isCurrentDealer = getCurrentDealer() === player.id
    const wasPrevDealer = getPrevDealer() === player.id

    console.log("getCurrentDealer():", getCurrentDealer())
    console.log("getPrevDealer():", getPrevDealer())
    console.log("isCurrentDealer:", isCurrentDealer)
    console.log("wasPrevDealer:", wasPrevDealer)

    if (!isCurrentDealer && !wasPrevDealer) return;

    switch (true) {
      // is current dealer + round forward
      case currentRoundNumber - prevRoundNumber > 0 && isCurrentDealer:
        animateBadge("down-enter")
        break;
      // is current dealer + round backward
      case currentRoundNumber - prevRoundNumber < 0 && isCurrentDealer:
        animateBadge("up-enter")
        break;
      // was prev dealer + round forward
      case currentRoundNumber - prevRoundNumber > 0 && wasPrevDealer:
        animateBadge("down-leave")
        break;
      // was prev dealer + round backward
      case currentRoundNumber - prevRoundNumber < 0 && wasPrevDealer:
        animateBadge("up-leave")
        break;
    }

  }, [currentRoundNumber])

  const getBadgeAnimation = (type: "up-enter" | "down-enter" | "up-leave" | "down-leave") => {
    switch (type) {
      case "up-enter":
        return {
          keyframes: {
            y: [15, 0]
          },
          options: {
            duration: transitionDuration,
            delay: transitionDuration
          },
        };
      case "down-enter":
        return {
          keyframes: {
            y: [-15, 0]
          },
          options: {
            duration: transitionDuration,
            delay: transitionDuration
          },
        };
      case "up-leave":
        return {
          keyframes: {
            y: [0, -15]
          },
          options: {
            duration: transitionDuration
          },
        };
      case "down-leave":
        return {
          keyframes: {
            y: [0, 15]
          },
          options: {
            duration: transitionDuration
          },
        };
    }
  }
  const animateBadge = (type: Parameters<typeof getBadgeAnimation>[0]) => {
    animateBadgeFn(badgeRef.current, { ...getBadgeAnimation(type)["keyframes"] }, { ...getBadgeAnimation(type)["options"] }) // dealer badge
  }

  return (
    <Badge
      className={cn(
        "opacity-0 bottom-0 left-0 z-50 absolute bg-[var(--color-black)] dark:bg-[var(--color-white)] text-[var(--color-white)] dark:text-[var(--color-black)] -translate-x-1 translate-y-1 transition-opacity select-none transition-discrete duration-200",
        getCurrentDealer() === player.id && "opacity-100 delay-200",
        getCurrentDealer() !== player.id && "!opacity-0 !delay-0",
        className
      )}
      asChild
    >
      <motion.span
        ref={badgeRef}
        className="transition-discrete"
        {...spanProps}
      >Dealer</motion.span>
    </Badge>
  );
}

const PlayerHeart = ({ className, ...params }: React.ComponentPropsWithoutRef<typeof motion.div>) => {
  return (
    <motion.div {...params}>
      <HeartIcon className={cn("text-red-500 fill-red-500", className)} />
    </motion.div>
  );
}

const PlayerIsDead = ({ className, ...params }: React.ComponentPropsWithoutRef<typeof motion.div>) => {
  return (
    <motion.div className="right-2 absolute" {...params}>
      <SkullIcon className={cn("", className)} />
    </motion.div>
  );
}

const PlayerIsWinner = ({ className, ...params }: React.ComponentPropsWithoutRef<typeof motion.div>) => {
  return (
    <motion.div className="right-2 absolute" {...params}>
      <CrownIcon className={cn("text-yellow-300 fill-yellow-300", className)} />
    </motion.div>
  );
}

const SwimmingEffect = ({ ...params }: React.ComponentProps<"div">) => {
  const { meta } = useSchwimmenMetaStore()
  return (
    <div className="bottom-0 absolute inset-x-0 h-12 overflow-hidden" {...params}>
      <AnimatePresence propagate>
        <motion.div className="relative w-full h-full">

          <motion.svg
            className="bottom-0 left-0 absolute w-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: 20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.path
              d="M0,96L48,101.3C96,107,192,117,288,106.7C384,96,480,64,576,58.7C672,53,768,75,864,80C960,85,1056,75,1152,74.7C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              fill="rgba(0, 132, 206, 0.6)"
              animate={{
                d: [
                  "M0,96L48,101.3C96,107,192,117,288,106.7C384,96,480,64,576,58.7C672,53,768,75,864,80C960,85,1056,75,1152,74.7C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z",
                  "M0,64L48,74.7C96,85,192,107,288,112C384,117,480,107,576,90.7C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                ]
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 4,
                ease: "easeInOut"
              }}
            />
          </motion.svg>

          <motion.svg
            className="bottom-0 left-0 absolute w-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: 20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.path
              d="M0,96L60,92C120,88,240,80,360,78.7C480,77,600,83,720,88C840,93,960,99,1080,98.7C1200,99,1320,93,1380,90.7L1440,88L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
              fill="rgba(0, 132, 206, 0.7)"
              animate={{
                d: [
                  "M0,96L60,92C120,88,240,80,360,78.7C480,77,600,83,720,88C840,93,960,99,1080,98.7C1200,99,1320,93,1380,90.7L1440,88L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z",
                  "M0,84L60,86C120,88,240,92,360,93.3C480,94.7,600,94,720,92C840,90,960,86,1080,85.3C1200,84.7,1320,86.3,1380,87.3L1440,88L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
                ]
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 3,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </motion.svg>

          <motion.div
            className="right-1 bottom-0 absolute"
            initial={{ x: 50, y: -50 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: 50, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{
                y: [0, -4, 0],
                x: [-2, 2, -2]
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <ManSwimmingIcon className={cn("transition-[width,height] [&_svg]:transition-[width,height] duration-200 [&_svg]:duration-200", SCHWIMMEN_GAME_ICON_SIZE_MAP[meta.uiSize[0]])} />
            </motion.div>
          </motion.div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
