"use client";

import type { Editor } from "@tiptap/react";
import { Paperclip } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  forwardRef,
  useState,
  useRef,
  type Dispatch,
  type SetStateAction,
  type FC,
  type KeyboardEvent,
  type ChangeEvent,
  type MouseEvent,
} from "react";

import { CornerDownLeftIcon } from "@/app/components/tiptap/tiptap-icons/corner-down-left-icon";
import { LinkIcon } from "@/app/components/tiptap/tiptap-icons/link-icon";
import { TrashIcon } from "@/app/components/tiptap/tiptap-icons/trash-icon";
import type { UseLinkPopoverConfig } from "@/app/components/tiptap/tiptap-ui/link-popover";
import { useLinkPopover } from "@/app/components/tiptap/tiptap-ui/link-popover";
import type { ButtonProps } from "@/app/components/tiptap/tiptap-ui-primitive/button";
import {
  Button,
  ButtonGroup,
} from "@/app/components/tiptap/tiptap-ui-primitive/button";
import {
  Card,
  CardBody,
  CardItemGroup,
} from "@/app/components/tiptap/tiptap-ui-primitive/card";
import {
  Input,
  InputGroup,
} from "@/app/components/tiptap/tiptap-ui-primitive/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/tiptap/tiptap-ui-primitive/popover";
import { Separator } from "@/app/components/tiptap/tiptap-ui-primitive/separator";
import { useIsMobile } from "@/hooks/tiptap/use-mobile";
import { useTiptapEditor } from "@/hooks/tiptap/use-tiptap-editor";
import { useTabContents } from "@/hooks/useTabContents";

export interface LinkMainProps {
  /**
   * The URL to set for the link.
   */
  url: string;
  /**
   * Function to update the URL state.
   */
  setUrl: Dispatch<SetStateAction<string | null>>;
  /**
   * Function to set the link in the editor.
   */
  setLink: () => void;
  /**
   * Function to remove the link from the editor.
   */
  removeLink: () => void;
  /**
   * Whether the link is currently active in the editor.
   */
  isActive: boolean;
  /**
   * User ID for file upload to GCS.
   */
  userid: string;
}

export interface LinkPopoverProps
  extends Omit<ButtonProps, "type">, UseLinkPopoverConfig {
  /**
   * Callback for when the popover opens or closes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Whether to automatically open the popover when a link is active.
   * @default true
   */
  autoOpenOnLinkActive?: boolean;
  /**
   * User ID for file upload to GCS.
   */
  userid: string;
}

/**
 * Link button component for triggering the link popover
 */
export const LinkButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        type="button"
        className={className}
        data-style="ghost"
        role="button"
        tabIndex={-1}
        aria-label="Link"
        tooltip="Link"
        ref={ref}
        {...props}
      >
        {children || <LinkIcon className="tiptap-button-icon" />}
      </Button>
    );
  },
);

LinkButton.displayName = "LinkButton";

/**
 * Main content component for the link popover
 */
const LinkMain: FC<LinkMainProps> = ({
  url,
  setUrl,
  setLink,
  removeLink,
  isActive,
  userid,
}) => {
  const isMobile = useIsMobile();
  const tEditor = useTranslations("editor");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadPdfToGCS, deletePdfFromGCS } = useTabContents(userid);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setLink();
    }
  };

  const handleFileAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveLink = useCallback(() => {
    // GCS에 업로드된 파일이면 삭제 요청 (fire-and-forget)
    const GCS_URL_PREFIX = "https://storage.googleapis.com/easiest-cv/";
    if (url && url.startsWith(GCS_URL_PREFIX)) {
      const filename = url.replace(GCS_URL_PREFIX, "");
      deletePdfFromGCS(filename).catch(() => {});
    }
    removeLink();
  }, [url, deletePdfFromGCS, removeLink]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !userid) return;

      if (file.type !== "application/pdf") {
        alert(tEditor("pdfOnly"));
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userid", userid);

        const result = await uploadPdfToGCS(formData);
        const pdfUrl = result?.pdfUrl;

        if (pdfUrl) {
          setUrl(pdfUrl);
        }
      } catch (error) {
        console.error("파일 업로드 실패:", error);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [userid, setUrl, tEditor],
  );

  return (
    <Card
      style={{
        ...(isMobile ? { boxShadow: "none", border: 0 } : {}),
      }}
    >
      <CardBody
        style={{
          ...(isMobile ? { padding: 0 } : {}),
        }}
      >
        <CardItemGroup orientation="horizontal">
          <InputGroup>
            <Input
              type="url"
              placeholder="https://"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </InputGroup>

          <ButtonGroup orientation="horizontal">
            <Button
              type="button"
              onClick={setLink}
              title="Apply link"
              disabled={!url && !isActive}
              data-style="ghost"
            >
              <CornerDownLeftIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>

          <Separator />

          <ButtonGroup orientation="horizontal">
            {userid && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <Button
                  type="button"
                  onClick={handleFileAttachClick}
                  disabled={isUploading}
                  data-style="ghost"
                  tooltip={
                    isUploading
                      ? tEditor("fileAttachUploading")
                      : tEditor("fileAttach")
                  }
                >
                  <Paperclip
                    className="tiptap-button-icon"
                    style={{ width: "14px", height: "14px" }}
                  />
                </Button>
              </>
            )}

            <Button
              type="button"
              onClick={handleRemoveLink}
              title="Remove link"
              disabled={!url && !isActive}
              data-style="ghost"
            >
              <TrashIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
};

/**
 * Link content component for standalone use
 */
export const LinkContent: FC<{
  editor?: Editor | null;
  userid: string;
}> = ({ editor, userid }) => {
  const linkPopover = useLinkPopover({
    editor,
  });

  return <LinkMain {...linkPopover} userid={userid} />;
};

/**
 * Link popover component for Tiptap editors.
 *
 * For custom popover implementations, use the `useLinkPopover` hook instead.
 */
export const LinkPopover = forwardRef<HTMLButtonElement, LinkPopoverProps>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      onSetLink,
      onOpenChange,
      autoOpenOnLinkActive = true,
      userid,
      onClick,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = useState(false);

    const {
      isVisible,
      canSet,
      isActive,
      url,
      setUrl,
      setLink,
      removeLink,
      label,
      Icon,
    } = useLinkPopover({
      editor,
      hideWhenUnavailable,
      onSetLink,
    });

    const handleOnOpenChange = useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      },
      [onOpenChange],
    );

    const handleSetLink = useCallback(() => {
      setLink();
      setIsOpen(false);
    }, [setLink]);

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setIsOpen(!isOpen);
      },
      [onClick, isOpen],
    );

    useEffect(() => {
      if (autoOpenOnLinkActive && isActive) {
        setIsOpen(true);
      }
    }, [autoOpenOnLinkActive, isActive]);

    if (!isVisible) {
      return null;
    }

    return (
      <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
        <PopoverTrigger asChild>
          <LinkButton
            disabled={!canSet}
            data-active-state={isActive ? "on" : "off"}
            data-disabled={!canSet}
            aria-label={label}
            aria-pressed={isActive}
            onClick={handleClick}
            {...buttonProps}
            ref={ref}
          >
            {children ?? <Icon className="tiptap-button-icon" />}
          </LinkButton>
        </PopoverTrigger>

        <PopoverContent>
          <LinkMain
            url={url}
            setUrl={setUrl}
            setLink={handleSetLink}
            removeLink={removeLink}
            isActive={isActive}
            userid={userid}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

LinkPopover.displayName = "LinkPopover";

export default LinkPopover;
