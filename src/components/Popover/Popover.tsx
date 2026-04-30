import { useFloating, arrow, FloatingPortal, shift, offset, type Placement } from '@floating-ui/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type ElementType } from 'react'

interface Props {
  children: React.ReactNode
  renderPopover?: React.ReactNode
  className?: string
  as?: ElementType
  initalOpen?: boolean
  placement?: Placement
  offsetValue?: number
}

export default function Popover({
  children,
  renderPopover,
  className,
  as: Element = 'div',
  initalOpen,
  placement = 'bottom-end',
  offsetValue = 0
}: Props) {
  // 1. SỬ DỤNG useState THAY CHO useRef
  const [arrowEl, setArrowEl] = useState<HTMLElement | null>(null)

  // 2. BÓC TÁCH THẲNG setReference VÀ setFloating ĐỂ LINTER KHÔNG THẤY CHỮ "refs"
  const {
    refs: { setReference, setFloating },
    floatingStyles,
    middlewareData
  } = useFloating({
    middleware: [
      offset(offsetValue),
      shift({ padding: 12 }),
      arrow({
        element: arrowEl
      })
    ],
    placement: placement
  })

  const [open, setOpen] = useState(initalOpen || false)
  const togglePopover = () => setOpen(!open)

  return (
    // 3. GỌI TRỰC TIẾP setReference
    <Element className={className} ref={setReference} onClick={togglePopover}>
      {children}
      <FloatingPortal>
        <AnimatePresence>
          {open && (
            // 4. GỌI TRỰC TIẾP setFloating
            <div ref={setFloating} style={floatingStyles} className="z-[9999]">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  transformOrigin: `${middlewareData.arrow?.x}px top`
                }}
                onClick={(e) => e.stopPropagation()} // Chặn click lan ra ngoài
              >
                <div
                  ref={setArrowEl} // Gắn hàm cập nhật state vào đây
                  style={{
                    position: 'absolute',
                    left: middlewareData.arrow?.x,
                    top: middlewareData.arrow?.y
                  }}
                  className="z-1 absolute translate-y-[-98%] border-[11px] border-x-transparent border-b-slate-100 border-t-transparent"
                />
                {renderPopover}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
