import React, { useState, useRef, useEffect } from "react";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

function Canvas() {
  const [rectangles, setRectangles] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [canvasReady, setCanvasReady] = useState(false);

  const canvasRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  const mousedownRef = useRef(false);
  const lastMouseRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasReady(true);
    }
  }, [canvasRef]);

  const handleMouseDown = e => {
    e.preventDefault();
    mousedownRef.current = true;
    lastMouseRef.current = null;
    mouseRef.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };
  };

  const handleMouseMove = e => {
    if (!mousedownRef.current) {
      return;
    }

    lastMouseRef.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };
  };

  const handleMouseUp = e => {
    e.preventDefault();
    mousedownRef.current = false;

    const rect = getRectFromPoints(mouseRef.current, lastMouseRef.current || mouseRef.current);

    if (rect) {
      setRectangles([...rectangles, { ...rect, text: "" }]);
    }

    lastMouseRef.current = null;
  };

  const getRectFromPoints = (start, end) => {
    if (!start || !end) {
      return null;
    }

    return {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(start.x - end.x),
      height: Math.abs(start.y - end.y)
    };
  };

  const handleRectClick = index => {
    setSelected(index);
  };

  const handleRectClose = index => {
    setRectangles(rectangles.filter((_, i) => i !== index));
    setSelected(-1);
  };

  const handleTextChange = (index, event) => {
    setRectangles(
      rectangles.map((rect, i) => {
        if (i === index) {
          return {
            ...rect,
            text: event.target.value
          };
        } else {
          return rect;
        }
      })
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />
      {canvasReady && (
        <>
          {rectangles.map((rect, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: rect.y,
                left: rect.x,
                width: rect.width,
                height: rect.height,
                border: selected === i ? "2px solid yellow" : "2px solid black",
                cursor: "move"
              }}
              onClick={() => handleRectClick(i)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "4px",
                  backgroundColor: "white",
                  borderTop: "1px solid black",
                  borderBottom: "1px solid black"
                }}
              >
                <div>{i + 1}</div>
                <div style={{ cursor: "pointer" }} onClick={() => handleRectClose(i)}>
                  x
                </div>
              </div>
              <textarea
                style={{
                  width: "100%",
                  height: "calc(100% - 24px)",
                  border: "none",
                  padding: "4px",
                  resize: "none",
                  outline: "none",
                  backgroundColor: "transparent"
                }}
                value={rect.text}
                onChange={event => handleTextChange(i, event)}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Canvas;
