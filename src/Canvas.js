import React, { useState, useRef, useEffect } from "react";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

function Canvas() {
  const [rectangles, setRectangles] = useState([]);
  const [selected, setSelected] = useState({ rectangle: -1, div: -1 });

  const [canvasReady, setCanvasReady] = useState(false);
  const [drawingRect, setDrawingRect] = useState(null);

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

    const clickedRectIndex = rectangles.findIndex(rect => {
      const rectLeft = rect.x;
      const rectTop = rect.y;
      const rectRight = rect.x + rect.width;
      const rectBottom = rect.y + rect.height;
      return mouseRef.current.x >= rectLeft && mouseRef.current.x <= rectRight && mouseRef.current.y >= rectTop && mouseRef.current.y <= rectBottom;
    });

    if (clickedRectIndex !== -1) {
      setSelected(clickedRectIndex);
      const rectDiv = document.getElementById(`rectDiv-${clickedRectIndex}`);
      if (rectDiv) {
        rectDiv.style.border = "2px solid orange";
      }
    }
  };

  const handleMouseMove = e => {
    if (!mousedownRef.current) {
      return;
    }

    lastMouseRef.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };

    setDrawingRect(getRectFromPoints(mouseRef.current, lastMouseRef.current));
  };

  const handleMouseUp = e => {
    e.preventDefault();
    mousedownRef.current = false;

    if (lastMouseRef.current) {
      const rect = getRectFromPoints(mouseRef.current, lastMouseRef.current);

      if (rect && rect.width > 0 && rect.height > 0) {
        // check if a valid rectangle is being drawn
        setRectangles([...rectangles, { ...rect, text: "" }]);
      }
    }

    lastMouseRef.current = null;
    setDrawingRect(false);
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
    const rectDiv = document.getElementById(`rectDiv-${index}`);
    if (rectDiv) {
      rectDiv.style.border = "2px solid orange";
    }
  };

  const handleRectClose = index => {
    setRectangles(rectangles.filter((_, i) => i !== index));
    if (selected === index) {
      setSelected(-1);
    }
    const rectDiv = document.getElementById(`rectDiv-${index}`);
    if (rectDiv) {
      rectDiv.style.border = "2px solid black";
    }
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
    <main className="content">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{ zIndex: 0 }} />
      {canvasReady && (
        <section>
          {rectangles.map((rect, i) => (
            <div
              key={i}
              id={`rectDiv-${i}`}
              className="selection-rect"
              style={{
                position: "absolute",
                zIndex: 1,
                top: rect.y,
                left: rect.x,
                width: rect.width,
                height: rect.height,
                border: selected === i ? "2px dashed orange" : "2px dashed #fff",
                cursor: "move"
              }}
              onClick={() => handleRectClick(i)}
            >
              <div className="number-label">
                <div>{i + 1}</div>
                <div style={{ cursor: "pointer", marginLeft: "20px" }} onClick={() => handleRectClose(i)}>
                  x
                </div>
              </div>
              {/* if you need to type inside the selection rectangles you can use the textarea here*/}
              {/* <textarea
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
              /> */}
            </div>
          ))}
          {drawingRect && (
            <section className="sidebar">
              <div
                style={{
                  position: "absolute",
                  top: drawingRect.y,
                  left: drawingRect.x,
                  width: drawingRect.width,
                  height: drawingRect.height,
                  border: "2px dashed grey"
                }}
              />
            </section>
          )}
          <aside className="side-items">
            {rectangles.map((rect, i) => (
              <section key={i} className="side-item" onClick={() => handleRectClick(i)}>
                <div className="side-num">{i + 1}</div>
                <input className="side-input" type="text" value={rect.text} onChange={event => handleTextChange(i, event)} />
                <button className="side-button" onClick={() => handleRectClose(i)}>
                  x
                </button>
              </section>
            ))}
          </aside>
        </section>
      )}
    </main>
  );
}
export default Canvas;
