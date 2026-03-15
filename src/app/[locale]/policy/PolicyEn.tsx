import Title from "@/app/components/common/Title";

export default function PolicyEn() {
  return (
    <>
      <Title title="Terms of Service & Privacy Policy" />

      <div className="w-full max-w-body px-4 pb-8">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
            This document explains the rules you need to know when using{" "}
            <strong>Easiest CV</strong> and how we manage your precious personal
            information.
          </p>

          <hr className="my-8 border-gray-300 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              1. Terms of Service
            </h2>

            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                Article 1 (Copyright and Responsibility of Content)
              </h3>
              <ol className="ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  The copyright of all contents such as text, images, and links
                  posted by the user within the service belongs to the{" "}
                  <strong>author</strong>.
                </li>
                <li>
                  All legal responsibilities such as defamation and copyright
                  infringement arising from the content posted by the user lie
                  with the <strong>publisher</strong>, and the platform is not
                  responsible for this.
                </li>
                <li>
                  Posts that infringe upon the rights of others or are
                  inappropriate may be deleted or restricted from exposure
                  without notice according to the operator&apos;s judgment.
                </li>
              </ol>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                Article 2 (Account Management)
              </h3>
              <ol className="ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  This service collects email information to check for duplicate
                  account registrations, send welcome emails, and reset
                  passwords. The user is responsible for account loss due to
                  incorrect email entry.
                </li>
                <li>
                  If you sign up by using someone else&apos;s information, your
                  use of the service may be suspended.
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              2. Privacy Policy
            </h2>

            <p className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
              <strong>Easiest CV</strong> collects only the minimum information
              necessary for site operation and does not provide information to
              third parties without user consent.
            </p>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                ① Collected Personal Information Items
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Required items</strong>: ID (userid), password,
                  Name(Nickname), email address
                </li>
                <li>
                  <strong>Optional items</strong>: Information entered directly
                  by the user, such as text, images, and files
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                ② Purpose of Use of Personal Information
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  Confirmation of membership registration and personal
                  identification
                </li>
                <li>
                  Confirmation of duplicate email registration when signing up
                </li>
                <li>Sending a welcome email upon completion of sign-up</li>
                <li>Sending a temporary password in case of a lost password</li>
                <li>
                  Organizing public content within the user&apos;s account
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                ③ Retention and Destruction of Personal Information
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  If a user requests account deletion, the collected personal
                  information is destroyed without delay.
                </li>
                <li>
                  However, some data may be kept for a certain period of time to
                  prevent fraudulent use of the service.
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                ④ Personal Information Protection Manager
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Contact:{" "}
                <a
                  href="mailto:admin@easiest-cv.com"
                  className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  admin@easiest-cv.com
                </a>
              </p>
            </div>
          </section>

          <hr className="my-8 border-gray-300 dark:border-gray-700" />

          <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Date of Announcement</strong>: December 20, 2025
            </p>
            <p>
              <strong>Effective Date</strong>: December 20, 2025
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
