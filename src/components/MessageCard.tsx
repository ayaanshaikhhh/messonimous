// "use client";

// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// import { Button } from "./ui/button";
// import { Message } from "@/types/Message";

// import axios from "axios";
// import { toast } from "sonner";

// type MessageCardProps = {
//   message: Message;
//   onMessageDelete: (messageId: string) => void;
// };

// const MessageCard = ({
//   message,
//   onMessageDelete,
// }: MessageCardProps) => {
//   const handleMessageDeleteConfirm = async () => {
//     try {
//       const response = await axios.delete(
//         `/api/delete-messages/${message._id}`
//       );

//       toast.success("Success", {
//         description: response.data.message,
//       });

//       onMessageDelete(message._id);
//     } catch (error: any) {
//       toast.error("Error", {
//         description:
//           error.response?.data?.message ??
//           "Failed to delete message.",
//       });
//     }
//   };

//   return (
//     <Card className="shadow-md transition-all hover:shadow-lg">
//       <CardHeader>
//         <div className="flex items-start justify-between">
//           <div>
//             <CardTitle>Anonymous Message</CardTitle>

//             <CardDescription>
//               {new Date(message.createdAt).toLocaleString()}
//             </CardDescription>
//           </div>

//           <CardAction>
//             <AlertDialog>
//               <AlertDialogTrigger
//                 render={
//                   <Button variant="destructive" size="sm">
//                     Delete
//                   </Button>
//                 }
//               />

//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>
//                     Delete this message?
//                   </AlertDialogTitle>

//                   <AlertDialogDescription>
//                     This action cannot be undone. This
//                     message will be permanently deleted.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>

//                 <AlertDialogFooter>
//                   <AlertDialogCancel>
//                     Cancel
//                   </AlertDialogCancel>

//                   <AlertDialogAction
//                     onClick={handleMessageDeleteConfirm}
//                   >
//                     Delete
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </CardAction>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <p className="text-sm leading-7 text-muted-foreground">
//           {message.content}
//         </p>
//       </CardContent>

//       <CardFooter>
//         <p className="text-xs text-muted-foreground">
//           Anonymous Feedback
//         </p>
//       </CardFooter>
//     </Card>
//   );
// };

// export default MessageCard;




"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "./ui/button";
import { Message } from "@/types/Message";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

type ApiErrorResponse = {
  success: boolean;
  message: string;
};

const MessageCard = ({
  message,
  onMessageDelete,
}: MessageCardProps) => {
 
const handleMessageDeleteConfirm = async () => {
  try {
    const response = await axios.delete(
      `/api/delete-messages/${message._id}`
    );

    toast.success(response.data.message);

    onMessageDelete(message._id);
  } catch (error) {
    const axiosError = error as AxiosError<{
      success: boolean;
      message: string;
    }>;

    toast.error("Error", {
      description:
        axiosError.response?.data.message ??
        "Failed to delete message.",
    });
  }
};


  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Anonymous Message</CardTitle>

            <CardDescription>
              {new Date(message.createdAt).toLocaleString()}
            </CardDescription>
          </div>

          <CardAction>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                }
              />

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete this message?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone. This message
                    will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={handleMessageDeleteConfirm}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm leading-7 text-muted-foreground">
          {message.content}
        </p>
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Anonymous Feedback
        </p>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;

