"use client"

//* next/react
import React from "react";

//* packages
import { AnimatePresence, motion, useTime, useTransform } from "motion/react";

//* stores
import { GameParticipantWithUser, useSchwimmenGameStore } from "@/store/schwimmenGameStore";

//* lib
import { cn } from "@/lib/utils";

//* icons
import { ManSwimmingIcon } from "@/components/icons/man-swimming";
import { HeartIcon, UserIcon } from "lucide-react";

//* components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export type PlayerProps = {
  player: GameParticipantWithUser
  lifes: number
  isSwimming: boolean
  isWinner: boolean
  isNotIdle: boolean
}
export const Player = (params: React.ComponentPropsWithRef<typeof motion.div> & PlayerProps) => {
  const { player, lifes, isSwimming, isWinner, isNotIdle, className, ref, ...rest } = params

  //* hooks here
  const { rounds, latestSyncedRounds, lastPlayersHit } = useSchwimmenGameStore()
  // const { meta } = useSchwimmenMetaStore()
  const [animate, setAnimate] = React.useState<boolean>(false)
  React.useEffect(() => {
    setAnimate(true)
  }, [rounds])
  React.useEffect(() => {
    setAnimate(false)
  }, [latestSyncedRounds])


  const time = useTime()
  const rotate = useTransform(time, [0, 3000], [0, 360], { clamp: false })
  const rotateFast = useTransform(time, [0, 1000], [0, 360], { clamp: false })
  const rotatingBg = useTransform(rotate, (r) =>
    `conic-gradient(from ${r}deg, red, red, red, yellow, red, red, red)`
  )
  const rotatingBgFast = useTransform(rotateFast, (r) =>
    `conic-gradient(from ${r}deg, red, red, yellow, red, red, red, yellow, red, red)`
  )

  //* variables
  const playerName = player.user ? (player.user.displayUsername || player.user.name) : player.displayName
  const lifesWithKey = Array.from({ length: lifes }).map((_, idx) => ({ key: idx }))

  const getAnimationProps = (type: "pulse" | "shake" | "default") => {
    switch (type) {
      case "pulse":
        return {
          animate: {
            scale: [1, 1.02, 1],
          },
          transition: {
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          },
        };
      case "shake":
        return {
          animate: {
            x: [0, -2, 4, -2, 0],
            y: [0, 1, 0, -1, 0, 1, 0, -1, 0],
          },
          transition: {
            duration: 0.3,
            // repeat: Infinity,
            ease: "easeInOut",
          },
        }
      default:
        return {
          animate: {
            scale: 1,
            x: 0,
          },
        };
    }
  };


  return (
    <motion.div
      className={cn(
        "relative cursor-pointer p-0.5 overflow-hidden rounded-lg",
        className
      )}
      // style={isNotIdle ? { background: rotatingBg } : {}}
      ref={ref}
      {...getAnimationProps(isNotIdle ? "pulse" : "default")}
      {...((animate && lastPlayersHit.includes(player.id)) && getAnimationProps("shake"))}
      {...rest}
    >

      {/* actual player card - has 0.375rem (= 6px) border to smooth out corner for animated border */}
      <div className={cn(
        "z-10 flex justify-between bg-background rounded-[0.375rem] overflow-hidden relative p-2"
      )}>
        {/* player image and name */}
        <div className="z-20 flex items-center gap-2" >
          <Avatar className="size-9">
            <AvatarImage src={player.user && player.user.image || undefined}></AvatarImage>
            <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="font-medium">{playerName}</span>
          </div>
        </div >

        {/* lifes */}
        <div className="flex flex-row-reverse items-center gap-1.5" >
          <AnimatePresence>
            {isSwimming
              //* specific death animation when swimming
              ? lifes > 0
                ? <SwimmingEffect />
                : <>dead</>
              //* normal death animation
              : lifes > 0
                ? lifesWithKey.map(({ key }) => (
                  <PlayerHeart
                    key={key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 100 }}
                    exit={{ opacity: 0 }}
                  />
                ))
                : <>dead</>
            }
          </AnimatePresence>
        </div >
      </div>

      {/* div with slightly negative inset to act as a border for animations */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-lg bg-border transition-colors",
          (isSwimming && !isNotIdle) && "bg-swimming",
          isNotIdle && "",
          isWinner && "",
        )}
        {...(isSwimming ? {
          animate: { y: [56, 0] },
          transition: { bounce: false, duration: 0.5 }
        } : {})}
        {...((isNotIdle && !animate) ? {
          //* ISSBUTRACT or ISNUKE
          style: { background: rotatingBg },
          transition: { ease: "easeInOut" }
        } : {
          //* ISIDLE
          style: { background: isSwimming ? "var(--swimming)" : "var(--border)" },
          transition: { ease: "easeInOut" }
        })}
        {...((animate && lastPlayersHit.includes(player.id)) && {
          //* ISSBUTRACT or ISNUKE
          style: { background: rotatingBgFast },
          transition: { ease: "easeInOut" }
        })}
      />

    </motion.div >
  );
}

const PlayerHeart = ({ ref, ...params }: React.ComponentPropsWithRef<typeof motion.div>) => {
  return (
    <motion.div ref={ref} {...params}>
      <HeartIcon
        className="text-red-500 size-8 fill-red-500"
      />
    </motion.div>
  );
}

const SwimmingEffect = ({ ...params }: React.ComponentProps<"div">) => {
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
              <ManSwimmingIcon className="size-8" />
            </motion.div>
          </motion.div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
};
