import React, { useState, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton } from "@mui/material";

import Asteroid1 from "./assets/planets/Asteroid-1.svg";
import Asteroid2 from "./assets/planets/Asteroid-2.svg";
import Asteroid3 from "./assets/planets/Asteroid-3.svg";
import Asteroid from "./assets/planets/Asteroid.svg";
import Earth from "./assets/planets/Earth.svg";
import Mars from "./assets/planets/Mars.svg";
import Moon from "./assets/planets/Moon.svg";
import Satellite from "./assets/planets/Satellite.svg";
import Saturn from "./assets/planets/Saturn.svg";
import Stars1 from "./assets/planets/Stars-1.svg";
import Stars2 from "./assets/planets/Stars-2.svg";
import Stars3 from "./assets/planets/Stars-3.svg";
import Stars from "./assets/planets/Stars.svg";
import Sun from "./assets/planets/Sun.svg";
import Ufo1 from "./assets/planets/Ufo-1.svg";
import Ufo from "./assets/planets/Ufo.svg";

export default function App() {
  const [spaceObjects, setSpaceObjects] = useState([]);
  const [isBlackHoleSucking, setIsBlackHoleSucking] = useState(false);
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const animationRef = useRef(null);
  const [showRefreshButton, setShowRefreshButton] = useState(false);

  const handleRefresh = () => {
    setIsBlackHoleSucking(false);
    setShowRefreshButton(false);
    generateSpaceObjects();
  };

  const svgFiles = [
    { src: Asteroid1, type: "asteroid" },
    { src: Asteroid2, type: "asteroid" },
    { src: Asteroid3, type: "asteroid" },
    { src: Asteroid, type: "asteroid" },
    { src: Earth, type: "planet" },
    { src: Mars, type: "planet" },
    { src: Moon, type: "planet" },
    { src: Satellite, type: "satellite" },
    { src: Saturn, type: "planet" },
    { src: Stars1, type: "stars" },
    { src: Stars2, type: "stars" },
    { src: Stars3, type: "stars" },
    { src: Stars, type: "stars" },
    { src: Sun, type: "sun" },
    { src: Ufo1, type: "ufo" },
    { src: Ufo, type: "ufo" },
  ];

  const initStars = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [];
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: 0.05 + Math.random() * 0.1,
        isSucking: false,
      });
    }

    starsRef.current = stars;
  };

  const animateStars = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const stars = starsRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star, index) => {
      if (isBlackHoleSucking) {
        // Calculate direction towards black hole center
        const dx = centerX - star.x;
        const dy = centerY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Accelerate stars towards black hole
        const speed = Math.max(0.5, 15 - distance / 100);
        star.x += (dx / distance) * speed;
        star.y += (dy / distance) * speed;

        // Shrink stars as they approach the black hole
        if (distance < 200) {
          star.radius = Math.max(0.1, star.radius - 0.05);
        }

        // If star is very close to black hole, reset it to a new position
        if (distance < 50) {
          if (Math.random() < 0.1) {
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
            star.radius = Math.random() * 1.5;
          } else {
            star.radius = 0;
          }
        }
      } else {
        // Regular twinkling animation when not sucking
        star.opacity += star.speed;
        if (star.opacity > 1) {
          star.opacity = 1;
          star.speed = -star.speed;
        } else if (star.opacity < 0.1) {
          star.opacity = 0.1;
          star.speed = -star.speed;
        }
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animateStars);
  };

  useEffect(() => {
    initStars();
    animateStars();

    const handleResize = () => {
      initStars();
      generateSpaceObjects();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isBlackHoleSucking]);

  useEffect(() => {
    generateSpaceObjects();
  }, []);

  const generateSpaceObjects = () => {
    // Reset black hole sucking state
    setIsBlackHoleSucking(false);

    const newSpaceObjects = [];
    const objectCount = 30; // Number of space objects to generate
    const blackHoleRadius = 200; // Safety radius around black hole

    for (let i = 0; i < objectCount; i++) {
      // Generate random position
      let x, y;
      let isInBlackHoleArea;

      // Keep generating positions until we find one outside the black hole area
      do {
        x = Math.random() * (window.innerWidth - 100); // Subtract size to keep within viewport
        y = Math.random() * (window.innerHeight - 100);

        // Check if the position is within the black hole area
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const distanceFromCenter = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );

        isInBlackHoleArea = distanceFromCenter < blackHoleRadius;
      } while (isInBlackHoleArea);

      // Random SVG file from the list
      const svgObject = svgFiles[Math.floor(Math.random() * svgFiles.length)];

      // Random size for the object (with different ranges based on object type)
      let size;
      if (svgObject.type === "asteroid") {
        size = 15 + Math.random() * 15;
      } else if (svgObject.type === "stars") {
        size = 20 + Math.random() * 30;
      } else if (svgObject.type === "planet") {
        size = 40 + Math.random() * 20;
      } else if (svgObject.type === "sun") {
        size = 60 + Math.random() * 30;
      } else {
        size = 30 + Math.random() * 20;
      }

      // Random animation properties
      const rotation = Math.random() * 360;
      const animationDuration = 15 + Math.random() * 25;
      const floatDistance = 10 + Math.random() * 20;

      // Create a space object
      newSpaceObjects.push({
        id: i,
        x,
        y,
        size,
        rotation,
        animationDuration,
        floatDistance,
        svgSrc: svgObject.src,
        type: svgObject.type,
      });
    }

    setSpaceObjects(newSpaceObjects);
  };

  const handleSurpriseMe = () => {
    setIsBlackHoleSucking(true);
    setShowRefreshButton(false);

    setTimeout(() => {
      setSpaceObjects([]);
      setShowRefreshButton(true);
    }, 2500);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <a
        href="https://github.com/pranavsawant7/space-surprise"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          textDecoration: "none",
        }}
      >
        <IconButton
          sx={{
            color: "white",
            backgroundColor: "#333",
            "&:hover": { backgroundColor: "#555" },
          }}
        >
          <GitHubIcon fontSize="large" />
        </IconButton>
      </a>

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      <AnimatePresence>
        {spaceObjects.map((obj) => {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;

          return (
            <motion.div
              key={obj.id}
              initial={isBlackHoleSucking ? false : { opacity: 0, scale: 0 }}
              animate={
                isBlackHoleSucking
                  ? {
                      x: centerX - obj.x - obj.size / 2,
                      y: centerY - obj.y - obj.size / 2,
                      scale: 0,
                      opacity: 0,
                      rotate: obj.rotation + 720,
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      y: [obj.y, obj.y - obj.floatDistance, obj.y],
                      rotate: [obj.rotation, obj.rotation + 360],
                    }
              }
              exit={{
                x: centerX - obj.x - obj.size / 2,
                y: centerY - obj.y - obj.size / 2,
                scale: 0,
                opacity: 0,
                rotate: obj.rotation + 720,
              }}
              transition={
                isBlackHoleSucking
                  ? {
                      duration: 1.5 + Math.random(),
                      ease: [0.25, 0.1, 0.25, 1],
                    }
                  : {
                      opacity: { duration: 0.5 },
                      scale: { duration: 0.5 },
                      y: {
                        duration: obj.animationDuration,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      rotate: {
                        duration: obj.animationDuration * 2,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }
              }
              style={{
                position: "absolute",
                left: obj.x,
                top: obj.y,
                zIndex: 1,
                width: obj.size,
                height: obj.size,
              }}
            >
              <img
                src={obj.svgSrc}
                alt="Space object"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
      >
        {showRefreshButton ? (
          <Button
            variant="contained"
            onClick={handleRefresh}
            sx={{
              background: "#00ccff",
              color: "#000",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "3px solid #000",
              textTransform: "capitalize",
              boxShadow: "5px 5px 0px #000",
              "&:hover": {
                background: "#0099cc",
                boxShadow: "2px 2px 0px #000",
              },
              "&:active": {
                boxShadow: "0px 0px 0px #000",
                transform: "translate(2px, 2px)",
              },
            }}
          >
            Refresh
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSurpriseMe}
            disabled={isBlackHoleSucking}
            sx={{
              background: isBlackHoleSucking ? "#666" : "#ffcc00",
              color: isBlackHoleSucking ? "#ccc" : "#000",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "3px solid #000",
              textTransform: "capitalize",
              boxShadow: "5px 5px 0px #000",
              "&:hover": {
                background: isBlackHoleSucking ? "#666" : "#ff9900",
                boxShadow: "2px 2px 0px #000",
              },
              "&:active": {
                boxShadow: "0px 0px 0px #000",
                transform: "translate(2px, 2px)",
              },
            }}
          >
            {isBlackHoleSucking ? "Sucking..." : "Surprise Me"}
          </Button>
        )}
      </motion.div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
        }}
      >
        <motion.div
          animate={
            isBlackHoleSucking
              ? {
                  rotate: 360,
                  scale: [1, 1.5, 1.2],
                }
              : {
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }
          }
          transition={
            isBlackHoleSucking
              ? {
                  duration: 2,
                  repeat: 1,
                  ease: "easeInOut",
                }
              : {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: isBlackHoleSucking
                ? "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(34,34,34,0.9) 30%, rgba(89,0,255,0.8) 50%, rgba(255,165,0,0.8) 70%, rgba(255,255,255,0.4) 90%, transparent 100%)"
                : "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(34,34,34,0.8) 30%, rgba(89,0,255,0.6) 50%, rgba(255,165,0,0.6) 70%, rgba(255,255,255,0.2) 90%, transparent 100%)",
              boxShadow: isBlackHoleSucking
                ? "0 0 50px rgba(255,165,0,0.9), 0 0 100px rgba(89,0,255,0.8), 0 0 150px rgba(255,255,255,0.4)"
                : "0 0 30px rgba(255,165,0,0.8), 0 0 60px rgba(89,0,255,0.6)",
              transition: "all 0.5s ease-in-out",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
